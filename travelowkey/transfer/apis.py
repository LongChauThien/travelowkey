from .models import Taxi, Taxi_area, Taxi_area_detail, Taxi_invoice, Taxi_type
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from datetime import datetime
from django.db import transaction, OperationalError

@csrf_exempt
def get_locations(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                locations = Taxi_area.objects.values_list('pick_point', flat=True)
                response = {
                    'locations': list(locations)
                }
                return JsonResponse(response)
        except OperationalError as e:
            if e.args[0] == 1213:
                return get_locations(request)
            else:
                return JsonResponse({'locations': []})
    

def get_taxis(request):
    location = request.GET.get('lc', '')
    # start_date = request.GET.get('sd', '')
    # end_date = request.GET.get('ed', '')
    # start_time = request.GET.get('st', '')
    # end_time = request.GET.get('et', '')
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
        taxis_list = []
        for taxi in taxis:
            taxis_list.append({
                'id': taxi.id,
                'name': taxi.name,
                'luggage': taxi.luggage,
                'num_of_seat': taxi.num_of_seat,
                'price': taxi.price,
                'type': taxi.type_id.type,
            })
        response =  { 'taxis': taxis_list }
    except:
        response = { 'taxis': [] }
    return JsonResponse(response)
