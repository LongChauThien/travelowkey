from django.shortcuts import render

def hotel_search(request):
    return render(request, 'hotel/hotel-search/index.html')

def hotel_results(request):
    return render(request, 'hotel/hotel-display/index.html')
