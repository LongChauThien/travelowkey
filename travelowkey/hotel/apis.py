from .models import Hotel, Room, Room_invoice, Service, Service_detail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.db import transaction, OperationalError


@csrf_exempt
def get_locations(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                area = Hotel.objects.values_list('area', flat=True).distinct()
                response = {
                    'area': list(area)
                }
                return JsonResponse(response)
        except OperationalError as e:
            if e.args[0] == 1213:
                return get_locations(request)
            else:
                return JsonResponse({'area': []})
    
def get_rooms(request):
    location = request.GET.get('lc', '')
    check_in = request.GET.get('ci', '')
    check_out = request.GET.get('co', '')
    try:
        check_in = datetime.strptime(check_in, '%Y-%m-%d').date() if check_in else None
        check_out = datetime.strptime(check_out, '%Y-%m-%d').date() if check_out else None
    except ValueError:
        check_in = check_out = None
    adults = request.GET.get('adult', 1)
    childs = request.GET.get('child', 0)
    max = int(adults) + int(childs)
    sortType = request.GET.get('sortType', 'Giá thấp nhất')
    limit = request.GET.get('limit', 10)
    try:
        if sortType == 'Giá thấp nhất':
            rooms = Room.objects.filter(hotel_id__area=location, max__gte=max, state='Free').select_related('hotel_id').order_by('price')[:int(limit)]
        else:
            rooms = Room.objects.filter(hotel_id__area=location, max__gte=max, state='Free').select_related('hotel_id').order_by('-price')[:int(limit)]
        room_list = []
        for room in rooms:
            room_list.append({
                'id': room.id,
                'address': room.hotel_id.address,
                'name': room.name,
                'max': room.max,
                'price': room.price,
            })
        response = { 'rooms': room_list }
    except Exception as e:
        response = { 'error': str(e) }
    return JsonResponse(response)
