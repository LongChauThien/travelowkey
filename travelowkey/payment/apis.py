from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction, OperationalError
from flight.models import Flight, Flight_invoice
from bus.models import Bus, Bus_invoice
from transfer.models import Taxi, Taxi_invoice, Taxi_type, Taxi_area, Taxi_area_detail
from hotel.models import Room, Room_invoice, Hotel
from payment.models import Invoice

class get_FlightInfo(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        flight_id = request.GET.get('id', None)
        if not flight_id:
            return Response({'error': 'Flight ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            flight = Flight.objects.filter(id=flight_id).first()
            if not flight:
                return Response({'error': f'Flight {flight_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            flight_info = {
                'from': flight.from_location,
                'to': flight.to_location,
                'departureTime': flight.departure_time,
                'arrivalTime': flight.arrival_time,
                'travelTime': flight.travel_time,
                'price': flight.price,
                'seatClass': flight.seat_class,
                'date': flight.date,
                'name': flight.name,
            }
        return Response(flight_info, status=status.HTTP_200_OK)
    
class flight_Payment(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        flight_id = request.data.get('flightID', None)
        if not flight_id:
            return Response({'error': 'Flight ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        flight = Flight.objects.filter(id=flight_id).first()
        num_ticket = int(request.data.get('ticketNum', 0))
        total_price = int(request.data.get('totalPrice', 0))

        try:
            invoice = Invoice.objects.create(user_id=user, total_price=total_price)
            invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create invoice: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            flight_invoice = Flight_invoice(invoice_id=invoice, flight_id=flight, num_ticket=num_ticket)
            flight_invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create flight invoice: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        seatNum = flight.num_seat
        seatNum -= num_ticket
        Flight.objects.filter(id=flight_id).update(num_seat=seatNum)

        return Response({'message': 'Payment success'}, status=status.HTTP_200_OK)
    
class get_BusInfo(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        bus_id = request.GET.get('id', None)
        if not bus_id:
            return Response({'error': 'Bus ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            bus = Bus.objects.filter(id=bus_id).first()
            if not bus:
                return Response({'error': f'Bus {bus_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            bus_info = {
                'from': bus.from_location,
                'to': bus.to_location,
                'date': bus.date,
                'departureTime': bus.departure_time,
                'arrivalTime': bus.arrival_time,
                'travelTime': bus.travel_time,
                'name': bus.name,
                'pickPoint': bus.pick_point,
                'desPoint': bus.des_point,
                'price': bus.price,
                'seatCount': bus.seat_count,
            }
        return Response(bus_info, status=status.HTTP_200_OK)
    
class bus_Payment(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        bus_id = request.data.get('busID', None)
        if not bus_id:
            return Response({'error': 'Bus ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        bus = Bus.objects.filter(id=bus_id).first()
        if not bus:
            return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)
        num_ticket = int(request.data.get('ticketNum', 0))
        total_price = int(request.data.get('totalPrice', 0))
        try:
            invoice = Invoice.objects.create(user_id=user, total_price=total_price)
            invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create invoice: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            bus_invoice = Bus_invoice(invoice_id=invoice, bus_id=bus, num_ticket=num_ticket)
            bus_invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create bus invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        seatNum = bus.num_seat
        seatNum -= num_ticket
        Bus.objects.filter(id=bus_id).update(num_seat=seatNum)
        return Response({'message': 'Payment success'}, status=status.HTTP_200_OK)
    
class get_TaxiInfo(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        taxi_id = request.GET.get('id', None)
        if not taxi_id:
            return Response({'error': 'Taxi ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            taxi = Taxi.objects.filter(id=taxi_id).first()
            if not taxi:
                return Response({'error': f'Taxi {taxi_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            taxi_info = {
                'name': taxi.name,
                'price': taxi.price,
            }
        return Response(taxi_info, status=status.HTTP_200_OK)
    
class taxi_Payment(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        taxi_id = request.data.get('taxiID', None)
        start_date = request.data.get('startDate', None)
        end_date = request.data.get('endDate', None)
        start_time = request.data.get('startTime', None)
        end_time = request.data.get('endTime', None)
        if not taxi_id:
            return Response({'error': 'Taxi ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            taxi = Taxi.objects.filter(id=taxi_id).first()
            total_price = int(request.data.get('totalPrice', 0))
        try:
            invoice = Invoice.objects.create(user_id=user, total_price=total_price)
            invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            taxi_invoice = Taxi_invoice(invoice_id=invoice, taxi_id=taxi, departure_day=start_date, time_start=start_time, arrival_day=end_date, time_end=end_time)
            taxi_invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create taxi invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        Taxi.objects.filter(id=taxi_id).update(state='Busy')
        return Response({'message': 'Payment success'}, status=status.HTTP_200_OK)
    
class get_RoomInfo(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        room_id = request.GET.get('id', None)
        if not room_id:
            return Response({'error': 'Room ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            room = Room.objects.filter(id=room_id).select_related('hotel_id').first()
            if not room:
                return Response({'error': f'Room {room_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            room_info = {
                'name': room.name,
                'hotelName': room.hotel_id.name,
                'hotelAddress': room.hotel_id.address,
                'price': room.price,
            }
        return Response(room_info, status=status.HTTP_200_OK)
    
class room_Payment(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        room_id = request.data.get('roomID', None)
        check_in = request.data.get('checkIn', None)
        check_out = request.data.get('checkOut', None)
        if not room_id:
            return Response({'error': 'Room ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            room = Room.objects.filter(id=room_id).first()
            total_price = int(request.data.get('totalPrice', 0))
        try:
            invoice = Invoice.objects.create(user_id=user, total_price=total_price)
            invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            room_invoice = Room_invoice(invoice_id=invoice, room_id=room, check_in=check_in, check_out=check_out)
            room_invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create room invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        Room.objects.filter(id=room_id).update(state='Busy')
        return Response({'message': 'Payment success'}, status=status.HTTP_200_OK)
    
class load_Bill(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        invoices = Invoice.objects.filter(user_id=user)
        bills = []
        for invoice in invoices:
            bills.append({'Id':invoice.id,'Total':invoice.total_price})
        response = {
            'bills': bills
        }
        return Response(response, status=status.HTTP_200_OK)
    
class get_Bill(APIView):
    def get(self, request):
        id = request.GET.get('id', None)
        if not id:
            return Response({'error': 'Invoice ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                invoice_id = Invoice.objects.filter(id=id).select_for_update().first()
                if not invoice_id:
                    return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)
                flight_invoice = Flight_invoice.objects.filter(invoice_id=invoice_id).first()
                if flight_invoice:
                    response = {'type': 'FI', 'id': flight_invoice.id, 'timeStamp': invoice_id.create_at}
                    return Response(response, status=status.HTTP_200_OK)
                bus_invoice = Bus_invoice.objects.filter(invoice_id=invoice_id).first()
                if bus_invoice:
                    response = {'type': 'BI', 'id': bus_invoice.id, 'timeStamp': invoice_id.create_at}
                    return Response(response, status=status.HTTP_200_OK)
                taxi_invoice = Taxi_invoice.objects.filter(invoice_id=invoice_id).first()
                if taxi_invoice:
                    response = {'type': 'TI', 'id': taxi_invoice.id, 'timeStamp': invoice_id.create_at}
                    return Response(response, status=status.HTTP_200_OK)
                room_invoice = Room_invoice.objects.filter(invoice_id=invoice_id).first()
                if room_invoice:
                    response = {'type': 'RI', 'id': room_invoice.id, 'timeStamp': invoice_id.create_at}
                    return Response(response, status=status.HTTP_200_OK)
                return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)

        except OperationalError as e:
            if e.args[0] == 1213:
                return self.get(request)
            else:
                raise

        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class get_FlightBillDetail(APIView):
    def get(self, request):
        id = request.GET.get('id', None)
        if not id:
            return Response({'error': 'Flight Invoice ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                flight_invoice = Flight_invoice.objects.filter(id=id).select_related('flight_id').first()
                if not flight_invoice:
                    return Response({'error': 'Flight Invoice not found'}, status=status.HTTP_404_NOT_FOUND)
                flight_info = {
                    'from': flight_invoice.flight_id.from_location,
                    'to': flight_invoice.flight_id.to_location,
                    'departureTime': flight_invoice.flight_id.departure_time,
                    'arrivalTime': flight_invoice.flight_id.arrival_time,
                    'travelTime': flight_invoice.flight_id.travel_time,
                    'price': flight_invoice.flight_id.price,
                    'seatClass': flight_invoice.flight_id.seat_class,
                    'date': flight_invoice.flight_id.date,
                    'name': flight_invoice.flight_id.name,
                    'num_ticket': flight_invoice.num_ticket,
                    'qr_code': flight_invoice.QR_code.url
                }
                return Response(flight_info, status=status.HTTP_200_OK)
        except OperationalError as e:
            if e.args[0] == 1213:
                return self.get(request)
            else:
                raise
    
class get_BusBillDetail(APIView):
    def get(self, request):
        id = request.GET.get('id', None)
        if not id:
            return Response({'error': 'Bus Invoice ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                bus_invoice = Bus_invoice.objects.filter(id=id).select_related('bus_id').first()
                if not bus_invoice:
                    return Response({'error': 'Bus Invoice not found'}, status=status.HTTP_404_NOT_FOUND)
                bus_info = {
                    'from': bus_invoice.bus_id.from_location,
                    'to': bus_invoice.bus_id.to_location,
                    'date': bus_invoice.bus_id.date,
                    'departureTime': bus_invoice.bus_id.departure_time,
                    'arrivalTime': bus_invoice.bus_id.arrival_time,
                    'travelTime': bus_invoice.bus_id.travel_time,
                    'name': bus_invoice.bus_id.name,
                    'pickPoint': bus_invoice.bus_id.pick_point,
                    'desPoint': bus_invoice.bus_id.des_point,
                    'price': bus_invoice.bus_id.price,
                    'seatCount': bus_invoice.bus_id.seat_count,
                    'num_ticket': bus_invoice.num_ticket,
                    'qr_code': bus_invoice.QR_code.url
                }
                return Response(bus_info, status=status.HTTP_200_OK)
        except OperationalError as e:
            if e.args[0] == 1213:
                return self.get(request)
            else:
                raise
    

class get_TaxiBillDetail(APIView):
    def get(self, request):
        id = request.GET.get('id', None)
        if not id:
            return Response({'error': 'Taxi Invoice ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                taxi_invoice = Taxi_invoice.objects.filter(id=id).select_related('taxi_id').first()
                if not taxi_invoice:
                    return Response({'error': 'Taxi Invoice not found'}, status=status.HTTP_404_NOT_FOUND)
                pick_point = Taxi_area_detail.objects.filter(taxi_id=taxi_invoice.taxi_id).first().pick_point_id.pick_point
                taxi_info = {
                    'name': taxi_invoice.taxi_id.name,
                    'price': taxi_invoice.taxi_id.price,
                    'departureDay': taxi_invoice.departure_day,
                    'timeStart': taxi_invoice.time_start,
                    'arrivalDay': taxi_invoice.arrival_day,
                    'timeEnd': taxi_invoice.time_end,
                    'pickPoint': pick_point,
                    'type': taxi_invoice.taxi_id.type_id.type,
                    'qr_code': taxi_invoice.QR_code.url
                }
                return Response(taxi_info, status=status.HTTP_200_OK)
        except OperationalError as e:
            if e.args[0] == 1213:
                return self.get(request)
            else:
                raise
    
class get_RoomDetail(APIView):
    def get(self, request):
        id = request.GET.get('id', None)
        if not id:
            return Response({'error': 'Room Invoice ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                room_invoice = Room_invoice.objects.filter(id=id).select_related('room_id').first()
                if not room_invoice:
                    return Response({'error': 'Room Invoice not found'}, status=status.HTTP_404_NOT_FOUND)
                room_info = {
                    'roomName': room_invoice.room_id.name,
                    'name': room_invoice.room_id.hotel_id.name,
                    'address': room_invoice.room_id.hotel_id.address,
                    'price': room_invoice.room_id.price,
                    'checkIn': room_invoice.check_in,
                    'checkOut': room_invoice.check_out,
                    'max': room_invoice.room_id.max,
                    'qr_code': room_invoice.QR_code.url
                }
                return Response(room_info, status=status.HTTP_200_OK)
        except OperationalError as e:
            if e.args[0] == 1213:
                return self.get(request)
            else:
                raise