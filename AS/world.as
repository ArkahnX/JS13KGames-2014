package
{
   public class World extends Object
   {

      public function World(param1:int, param2:int)
      {
         super();
         this.width = param1;
         this.height = param2;
      }

      public var width:int;

      public var height:int;

      public var regions:Array;

      public var rooms:Array;

      public function getRoom(param1:int, param2:int) : Room
      {
         var _loc4_:Room = null;
         var _loc3_:* = 0;
         while(_loc3_ < this.rooms.length)
         {
            _loc4_ = this.rooms[_loc3_];
            if(_loc4_.mapX > param1 || _loc4_.mapX + _loc4_.mapW - 1 < param1 || _loc4_.mapY > param2 || _loc4_.mapY + _loc4_.mapH - 1 < param2)
            {
               _loc3_++;
               continue;
            }
            return _loc4_;
         }
         return null;
      }
   }
}
