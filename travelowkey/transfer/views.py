from django.shortcuts import render

def transfer_search(request):
    return render(request,'transfer/transfer-search/index.html')

def transfer_results(request):
    return render(request,'transfer/transfer-display/index.html')