from .models import Taxi, Taxi_area, Taxi_area_detail, Taxi_invoice, Taxi_type
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from datetime import datetime

@csrf_exempt
def get_locations(request):
    if request.method == 'POST':
        locations = Taxi_area.objects.values_list('pick_point', flat=True)
        response = {
            'locations': list(locations)
        }
        return JsonResponse(response)
    

def get_taxis(request):
    location = request.GET.get('lc', '')
    start_date = request.GET.get('sd', '')
    end_date = request.GET.get('ed', '')
    start_time = request.GET.get('st', '')
    end_time = request.GET.get('et', '')
    have_driver = request.GET.get('hd', '')
    type_id = '0' if have_driver=='true' else '1'
    sortType = request.GET.get('sortType', 'Giá thấp nhất')
    limit = request.GET.get('limit', 10)
    id_by_location = Taxi_area_detail.objects.filter(pick_point_id__pick_point__icontains=location).values_list('taxi_id', flat=True)
    try:
        if sortType == 'Giá thấp nhất':
            taxis = Taxi.objects.filter(type_id=type_id, id__in=id_by_location, state = 'Free').order_by('price')[:int(limit)]
        else:
            taxis = Taxi.objects.filter(type_id=type_id, id__in=id_by_location, state = 'Free').order_by('-price')[:int(limit)]
        response = { 'taxis': list(taxis.values()) }
    except:
        response = { 'taxis': [] }
    return JsonResponse(response)
