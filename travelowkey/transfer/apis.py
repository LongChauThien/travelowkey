from .models import Taxi, Taxi_area, Taxi_area_detail, Taxi_invoice, Taxi_type
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from datetime import datetime
from django.db import transaction, OperationalError
from django.db.models import Count, F

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


def get_recom_transfer(requset):
    result = Taxi_area_detail.objects.select_related('pick_point').values('pick_point_id__pick_point').annotate(count=Count('taxi_id'))
    response = {}
    try:
        with transaction.atomic():
            for item in result:
                pick_point = item['pick_point_id__pick_point']
                if 'Tân Sơn Nhất' in pick_point:
                    response['tsn'] = item['count']
                elif 'Nội Bài' in pick_point:
                    response['nb'] = item['count']
                elif 'Đà Nẵng' in pick_point:
                    response['dn'] = item['count']
                elif 'Đà Lạt' in pick_point:
                    response['dl'] = item['count']
                elif 'TP Hồ Chí Minh' in pick_point:
                    response['hcm'] = item['count']
                elif 'Hà Nội' in pick_point:
                    response['hn'] = item['count']
                elif 'Hải Phòng' in pick_point:
                    response['hp'] = item['count']
                elif 'Cần Thơ' in pick_point:
                    response['ct'] = item['count']
            return JsonResponse(response)
    except OperationalError as e:
        if e.args[0] == 1213:
            return get_recom_transfer(requset)
        else:
            return JsonResponse({})