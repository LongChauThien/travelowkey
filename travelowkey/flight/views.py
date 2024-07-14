from django.shortcuts import render


def flight_search(request):
    return render(request, 'flight/flight-search/index.html') 

def flight_results(request):
    return render(request, 'flight/flight-display/index.html')