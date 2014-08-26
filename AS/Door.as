package
{
   public class Door extends Object
   {

      public function Door(param1:int, param2:int, param3:String, param4:Room, param5:Room)
      {
         super();
         this.mapX = param1;
         this.mapY = param2;
         this.doorType = 0;
         this.dir = param3;
         this.room1 = param4;
         this.room2 = param5;
      }

      public var mapX:int;

      public var mapY:int;

      public var dir:String;

      public var room1:Room;

      public var room2:Room;

      public var doorType:int;

      public function other(param1:Room) : Room
      {
         return this.room1 == param1?this.room2:this.room1;
      }
   }
}
