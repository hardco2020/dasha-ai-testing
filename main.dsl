start node root //start node
{
  do
  {
    #connectSafe($phone); //connect via phone
    #waitForSpeech(1000);
    #sayText("Welcome to United Postal Service! How can I help you?");
    wait *; //wait for user speech
  }
  transitions
  {
    track_parcel: goto track_parcel on #messageHasIntent("track_parcel");
    missed_delivery: goto missed_delivery on #messageHasIntent("missed_delivery");
    where_is_point: goto where_is_point on #messageHasIntent("where_is_point");
    return_shipment: goto return_shipment on #messageHasIntent("return_shipment");
  }
}

node track_parcel
{
  do
  {
    #sayText("Sorry, tracking function is not implemented yet.");
    #disconnect();
    exit;
  }
}