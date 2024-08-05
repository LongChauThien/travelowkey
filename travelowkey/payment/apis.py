from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from flight.models import Flight, Flight_invoice
from bus.models import Bus, Bus_invoice
from transfer.models import Taxi, Taxi_invoice, Taxi_type
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
        else:
            flight = Flight.objects.filter(id=flight_id).first()
        num_ticket = int(request.data.get('ticketNum', 0))
        total_price = int(request.data.get('totalPrice', 0))
        # return Response({'user': user.id, 'flight_id':flight_id, 'num_ticket':num_ticket, 'total_price':total_price}, status=status.HTTP_200_OK)
        try:
            invoice = Invoice.objects.create(user_id=user, total_price=total_price)
            invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            flight_invoice = Flight_invoice.objects.create(invoice_id=invoice, flight_id=flight, num_ticket=num_ticket)
            flight_invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create flight invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
        else:
            bus = Bus.objects.filter(id=bus_id).first()
            num_ticket = int(request.data.get('ticketNum', 0))
            total_price = int(request.data.get('totalPrice', 0))
        try:
            invoice = Invoice.objects.create(user_id=user, total_price=total_price)
            invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            bus_invoice = Bus_invoice.objects.create(invoice_id=invoice, bus_id=bus, num_ticket=num_ticket)
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
            taxi_invoice = Taxi_invoice.objects.create(invoice_id=invoice, taxi_id=taxi, departure_day=start_date, time_start=start_time, arrival_day=end_date, time_end=end_time)
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
            room_invoice = Room_invoice.objects.create(invoice_id=invoice, room_id=room, check_in=check_in, check_out=check_out)
            room_invoice.save()
        except Exception as e:
            return Response({'error': f'Failed to create room invoice {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        Room.objects.filter(id=room_id).update(state='Busy')
        return Response({'message': 'Payment success'}, status=status.HTTP_200_OK)