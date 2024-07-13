from django.shortcuts import render

def bus_search(request):
    return render(request,'bus/bus-search/index.html')
