from .models import Flight, Flight_invoice
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.db import transaction, OperationalError
from django.utils import timezone
from django.db.models import Count

@csrf_exempt
def get_locations(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                from_locations = Flight.objects.values_list('from_location', flat=True).distinct()
                to_locations = Flight.objects.values_list('to_location', flat=True).distinct()
                response = {
                    'from': list(from_locations),
                    'to': list(to_locations)
                }
                return JsonResponse(response)
        except OperationalError as e:
            if e.args[0] == 1213:
                return get_locations(request)
            else:
                return JsonResponse({'from': [], 'to': []})
        
    
def get_flights(request):
    seat_class_dict = {'economy': 'Phổ thông', 'business': 'Thương gia'}
    locations = request.GET.get('lc', '')
    try:
        departure_code, arrival_code = locations.split('.') if '.' in locations else (None, None)
    except ValueError:
        departure_code = arrival_code = None

    date_time = request.GET.get('dt', '')
    try:
        date = datetime.strptime(date_time, '%Y-%m-%d').date() if date_time else None
    except ValueError:
        date = None

    seat_class = request.GET.get('st', 'economy')
    passengers_str = request.GET.get('ps', '1.0.0')
    try:
        passengers_list = map(int,passengers_str.split('.'))
        passengers = sum(passengers_list)
    except (IndexError, ValueError):
        passengers = 1

    sortType = request.GET.get('sortType', 'Giá thấp nhất')
    limit = request.GET.get('limit', 10)
    try:
        if sortType == 'Giá thấp nhất':
            flights = Flight.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, seat_class=seat_class_dict[seat_class], num_seat__gte=passengers).order_by('price')[:int(limit)]
        elif sortType == 'Giá cao nhất':
            flights = Flight.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, seat_class=seat_class_dict[seat_class], num_seat__gte=passengers).order_by('-price')[:int(limit)]
        elif sortType == 'Cất cánh sớm nhất':
            flights = Flight.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, seat_class=seat_class_dict[seat_class], num_seat__gte=passengers).order_by('departure_time')[:int(limit)]
        elif sortType == 'Cất cánh muộn nhất':
            flights = Flight.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, seat_class=seat_class_dict[seat_class], num_seat__gte=passengers).order_by('-departure_time')[:int(limit)] 
        elif sortType == 'Hạ cánh sớm nhất':
            flights = Flight.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, seat_class=seat_class_dict[seat_class], num_seat__gte=passengers).order_by('arrival_time')[:int(limit)]
        elif sortType == 'Hạ cánh muộn nhất':
            flights = Flight.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, seat_class=seat_class_dict[seat_class], num_seat__gte=passengers).order_by('-arrival_time')[:int(limit)]
        response = { 'flights': list(flights.values()) }
    except ValueError:
        response = { 'flights': [] }
    return JsonResponse(response)

def get_recom_flight(request):
    date = request.GET.get('date', '')
    try:
        date = datetime.strptime(date, '%Y-%m-%d').date() if date else None
    except ValueError:
        date = None
    try:
        with transaction.atomic():
            flights = Flight.objects.filter(date__gte=date,date__lte=date+timezone.timedelta(days=7)).values('from_location').annotate(count=Count('id'))
            response = {}
            for flight in flights:
                if 'HAN' in flight['from_location']:
                    response['HAN'] = flight['count']
                elif 'SGN' in flight['from_location']:
                        response['SGN'] = flight['count']
                elif 'DAD' in flight['from_location']:
                        response['DAD'] = flight['count']
                elif 'DLI' in flight['from_location']:
                        response['DLI'] = flight['count']
            return JsonResponse(response)
    except OperationalError as e:
        if e.args[0] == 1213:
            return get_recom_flight(request)
        else:
            return JsonResponse({})