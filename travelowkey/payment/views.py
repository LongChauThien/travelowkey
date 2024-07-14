from django.shortcuts import render

def payment_flight(request):
    return render(request, 'payment/payment-flight/index.html')

def payment_hotel(request):
    return render(request, 'payment/payment-hotel/index.html')

def payment_bus(request):
    return render(request, 'payment/payment-bus/index.html')

def payment_transfer(request):
    return render(request, 'payment/payment-transfer/index.html')

def bill_detail_flight(request):
    return render(request, 'payment/bill-detail/flight/index.html')

def bill_detail_hotel(request):
    return render(request, 'payment/bill-detail/hotel/index.html')

def bill_detail_bus(request):
    return render(request, 'payment/bill-detail/bus/index.html')

def bill_detail_transfer(request):
    return render(request, 'payment/bill-detail/transfer/index.html')
