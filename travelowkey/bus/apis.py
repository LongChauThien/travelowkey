from .models import Bus, Bus_invoice
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def get_locations(request):
    if request.method == 'POST':
        from_locations = Bus.objects.values_list('from_location', flat=True).distinct()
        to_locations = Bus.objects.values_list('to_location', flat=True).distinct()
        response = {
            'from': list(from_locations),
            'to': list(to_locations)
        }
        return JsonResponse(response)

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