from .models import Flight, Flight_invoice
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

@csrf_exempt
def get_locations(request):
    if request.method == 'POST':
        from_locations = Flight.objects.values_list('from_location', flat=True).distinct()
        to_locations = Flight.objects.values_list('to_location', flat=True).distinct()
        response = {
            'from': list(from_locations),
            'to': list(to_locations)
        }
        return JsonResponse(response)
    
def get_flights(request):
    seat_class_dict = {'economy': 'Phổ thông', 'business': 'Thương gia'}
    locations = request.GET.get('lc', '')
    if locations:
        departure_code, arrival_code = locations.split('.') if '.' in locations else (None, None)
    else:
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

    # response = {'departure': departure_code, 'arrival': arrival_code, 'date': date, 'seat_class': seat_class, 'passengers': passengers}
    flights = Flight.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, seat_class=seat_class_dict[seat_class], num_seat__gte=passengers)
    response = { 'flights': list(flights.values()) }
    return JsonResponse(response)