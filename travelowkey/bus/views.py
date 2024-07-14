from django.shortcuts import render

def bus_search(request):
    return render(request,'bus/bus-search/index.html')

def bus_result(request):
    return render(request,'bus/bus-display/index.html')