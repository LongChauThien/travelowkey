from django.shortcuts import render

def hotel_search(request):
    return render(request, 'hotel/hotel-search/index.html')
