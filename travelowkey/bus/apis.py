from .models import Bus, Bus_invoice
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction, OperationalError
from django.db.models import Count, F
from collections import defaultdict
from django.utils import timezone

@csrf_exempt
def get_locations(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                from_locations = Bus.objects.values_list('from_location', flat=True).distinct()
                to_locations = Bus.objects.values_list('to_location', flat=True).distinct()
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

def get_tickets(request):
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
    passengers = request.GET.get('ps', 1)
    sortType = request.GET.get('sortType', 'Giá thấp nhất')
    limit = request.GET.get('limit', 10)
    # return JsonResponse({'params':[departure_code, arrival_code, date, passengers, sortType, limit]})
    try:
        if sortType == 'Giá thấp nhất':
            tickets = Bus.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, num_seat__gte=passengers).order_by('price')[:int(limit)]
        elif sortType == 'Giá cao nhất':
            tickets = Bus.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, num_seat__gte=passengers).order_by('-price')[:int(limit)]
        elif sortType == 'Xuất phát sớm nhất':
            tickets = Bus.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, num_seat__gte=passengers).order_by('departure_time')[:int(limit)]
        elif sortType == 'Xuất phát muộn nhất':
            tickets = Bus.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, num_seat__gte=passengers).order_by('-departure_time')[:int(limit)]
        elif sortType == 'Đến nơi sớm nhất':
            tickets = Bus.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, num_seat__gte=passengers).order_by('arrival_time')[:int(limit)]
        elif sortType == 'Đến nơi muộn nhất':
            tickets = Bus.objects.filter(from_location=departure_code, to_location=arrival_code, date=date, num_seat__gte=passengers).order_by('-arrival_time')[:int(limit)]
        response = { 'tickets': list(tickets.values()) }
    except ValueError:
        response = { 'tickets': [] }
    return JsonResponse(response)

def get_recom_bus(request):
    date = request.GET.get('date', '')
    try:
        date = datetime.strptime(date, '%Y-%m-%d').date() if date else None
    except ValueError:
        date = None
    try:
        with transaction.atomic():
            from_locations = Bus.objects.filter(date__gte=date,date__lte=date+timezone.timedelta(days=7)).values(location = F('from_location')).annotate(count=Count('id'))
            to_locations = Bus.objects.filter(date__gte=date,date__lte=date+timezone.timedelta(days=7)).values(location= F('to_location')).annotate(count=Count('id'))
            total = from_locations.union(to_locations)
            aggregated_results = defaultdict(int)
            for item in total:
                aggregated_results[item['location']] += item['count']
            response = {}
            for location,count in aggregated_results.items():
                if 'Hà Nội' in location:
                    response['hn'] = count
                elif 'Khánh Hòa' in location:
                    response['kh'] = count
                elif 'TP Hồ Chí Minh' in location:
                    response['hcm'] = count
                elif 'Hải Phòng' in location:
                    response['hp'] = count
                elif 'Hà Tĩnh' in location:
                    response['ht'] = count
                elif 'Lâm Đồng' in location:
                    response['ld'] = count
                elif 'Đà Nẵng' in location:
                    response['dn'] = count
                elif 'Bà Rịa - Vũng Tàu' in location:
                    response['vt'] = count 
                elif 'An Giang' in location:
                    response['ag'] = count
            return JsonResponse(response)
    except OperationalError as e:
        if e.args[0] == 1213:
            return get_recom_bus(request)
        else:
            return JsonResponse({})