package
{
   import org.flixel.*;

   public class WorldMaker extends Object
   {

      public function WorldMaker(param1:int, param2:int)
      {
         super();
         this.width = param1;
         this.height = param2;
         this.rooms = new Array();
         this.frontiers = new Array();
         this.regions = new Array();
      }

      private var chanceOfAddingDoor:Number = 0.2;

      public var width:int;

      public var height:int;

      public var rooms:Array;

      public var frontiers:Array;

      public var currentRegion:Region;

      public var regions:Array;

      public function startAt(param1:int, param2:int, param3:Region) : void
      {
         this.frontiers = new Array();
         this.frontiers.push({
            "x":param1,
            "y":param2
         });
         this.currentRegion = param3;
         this.regions.push(param3);
      }

      public function startNewRegion(param1:Region) : void
      {
         var _loc2_:Object = FlxG.getRandom(this.getFrontiersForAllRooms());
         this.startAt(_loc2_.x,_loc2_.y,param1);
      }

      public function getFrontiersForAllRooms() : Array
      {
         var _loc2_:Room = null;
         var _loc1_:Array = new Array();
         for each(_loc2_ in this.rooms)
         {
            _loc1_ = this.addBorderingFrontiers(_loc1_,_loc2_);
         }
         return _loc1_;
      }

      public function addDoors(param1:Room) : void
      {
         var _loc3_:Door = null;
         var _loc2_:* = false;
         while(this.rooms.length > 1 && !_loc2_)
         {
            this.addDoorsAlongNorthWall(param1);
            this.addDoorsAlongSouthWall(param1);
            this.addDoorsAlongWestWall(param1);
            this.addDoorsAlongEastWall(param1);
            if(param1.region.rooms.length == 1)
            {
               _loc2_ = true;
            }
            for each(_loc3_ in param1.doors)
            {
               if(_loc3_.other(param1).region == param1.region)
               {
                  _loc2_ = true;
               }
            }
         }
      }

      private function addDoorsAlongNorthWall(param1:Room) : int
      {
         var _loc5_:Object = null;
         var _loc6_:Room = null;
         var _loc7_:Door = null;
         var _loc2_:Array = new Array();
         var _loc3_:int = param1.mapX;
         while(_loc3_ < param1.mapX + param1.mapW)
         {
            _loc6_ = this.getRoom(_loc3_,param1.mapY - 1);
            if(_loc6_ != null)
            {
               _loc2_.push({
                  "x":_loc3_,
                  "y":param1.mapY,
                  "other":_loc6_
               });
            }
            _loc3_++;
         }
         var _loc4_:* = 0;
         for each(_loc5_ in _loc2_)
         {
            if(!(FlxG.random() > this.chanceOfAddingDoor || param1.doors.indexOf(_loc5_) >= 0))
            {
               _loc7_ = new Door(_loc5_.x,_loc5_.y,"N",param1,_loc5_.other);
               param1.doors.push(_loc7_);
               _loc5_.other.doors.push(_loc7_);
               _loc4_++;
            }
         }
         return _loc4_;
      }

      private function addDoorsAlongSouthWall(param1:Room) : int
      {
         var _loc5_:Object = null;
         var _loc6_:Room = null;
         var _loc7_:Door = null;
         var _loc2_:Array = new Array();
         var _loc3_:int = param1.mapX;
         while(_loc3_ < param1.mapX + param1.mapW)
         {
            _loc6_ = this.getRoom(_loc3_,param1.mapY + param1.mapH);
            if(_loc6_ != null)
            {
               _loc2_.push({
                  "x":_loc3_,
                  "y":param1.mapY + param1.mapH - 1,
                  "other":_loc6_
               });
            }
            _loc3_++;
         }
         var _loc4_:* = 0;
         for each(_loc5_ in _loc2_)
         {
            if(!(FlxG.random() > this.chanceOfAddingDoor || param1.doors.indexOf(_loc5_) >= 0))
            {
               _loc7_ = new Door(_loc5_.x,_loc5_.y,"S",param1,_loc5_.other);
               param1.doors.push(_loc7_);
               _loc5_.other.doors.push(_loc7_);
               _loc4_++;
            }
         }
         return _loc4_;
      }

      private function addDoorsAlongWestWall(param1:Room) : int
      {
         var _loc5_:Object = null;
         var _loc6_:Room = null;
         var _loc7_:Door = null;
         var _loc2_:Array = new Array();
         var _loc3_:int = param1.mapY;
         while(_loc3_ < param1.mapY + param1.mapH)
         {
            _loc6_ = this.getRoom(param1.mapX - 1,_loc3_);
            if(_loc6_ != null)
            {
               _loc2_.push({
                  "x":param1.mapX,
                  "y":_loc3_,
                  "other":_loc6_
               });
            }
            _loc3_++;
         }
         var _loc4_:* = 0;
         for each(_loc5_ in _loc2_)
         {
            if(!(FlxG.random() > this.chanceOfAddingDoor || param1.doors.indexOf(_loc5_) >= 0))
            {
               _loc7_ = new Door(_loc5_.x,_loc5_.y,"W",param1,_loc5_.other);
               param1.doors.push(_loc7_);
               _loc5_.other.doors.push(_loc7_);
               _loc4_++;
            }
         }
         return _loc4_;
      }

      private function addDoorsAlongEastWall(param1:Room) : int
      {
         var _loc5_:Object = null;
         var _loc6_:Room = null;
         var _loc7_:Door = null;
         var _loc2_:Array = new Array();
         var _loc3_:int = param1.mapY;
         while(_loc3_ < param1.mapY + param1.mapH)
         {
            _loc6_ = this.getRoom(param1.mapX + param1.mapW,_loc3_);
            if(_loc6_ != null)
            {
               _loc2_.push({
                  "x":param1.mapX + param1.mapW - 1,
                  "y":_loc3_,
                  "other":_loc6_
               });
            }
            _loc3_++;
         }
         var _loc4_:* = 0;
         for each(_loc5_ in _loc2_)
         {
            if(!(FlxG.random() > this.chanceOfAddingDoor || param1.doors.indexOf(_loc5_) >= 0))
            {
               _loc7_ = new Door(_loc5_.x,_loc5_.y,"E",param1,_loc5_.other);
               param1.doors.push(_loc7_);
               _loc5_.other.doors.push(_loc7_);
               _loc4_++;
            }
         }
         return _loc4_;
      }

      public function createRooms(param1:int) : void
      {
         var _loc2_:* = 0;
         var _loc3_:int = this.rooms.length;
         while(_loc2_++ < param1 * 10 && this.rooms.length < _loc3_ + param1)
         {
            this.createRoom();
         }
      }

      public function createRoom() : void
      {
         var _loc1_:Object = FlxG.getRandom(this.frontiers);
         this.addRoom(this.growRoom(_loc1_.x,_loc1_.y));
      }

      public function addRoom(param1:Room) : void
      {
         if(param1 == null || !this.canPlaceRoom(param1.mapX,param1.mapY,param1.mapW,param1.mapH))
         {
            return;
         }
         var _loc2_:Array = new Array();
         _loc2_ = this.removeFrontiers(_loc2_,param1);
         this.frontiers = this.addBorderingFrontiers(_loc2_,param1);
         param1.mapColor = this.currentRegion.color;
         this.rooms.push(param1);
         this.currentRegion.rooms.push(param1);
         this.addDoors(param1);
      }

      public function removeFrontiers(param1:Array, param2:Room) : Array
      {
         var _loc3_:* = 0;
         while(_loc3_ < this.frontiers.length)
         {
            if(!(this.frontiers[_loc3_].x >= param2.mapX - 1 && this.frontiers[_loc3_].x <= param2.mapX + param2.mapW && this.frontiers[_loc3_].y >= param2.mapY && this.frontiers[_loc3_].y <= param2.mapY + param2.mapH - 1))
            {
               if(!(this.frontiers[_loc3_].x >= param2.mapX && this.frontiers[_loc3_].x <= param2.mapX + param2.mapW - 1 && this.frontiers[_loc3_].y >= param2.mapY - 1 && this.frontiers[_loc3_].y <= param2.mapY + param2.mapH))
               {
                  param1.push(this.frontiers[_loc3_]);
               }
            }
            _loc3_++;
         }
         return param1;
      }

      public function addBorderingFrontiers(param1:Array, param2:Room) : Array
      {
         var _loc3_:int = param2.mapX;
         while(_loc3_ < param2.mapX + param2.mapW)
         {
            if(this.canPlaceRoom(_loc3_,param2.mapY - 1,1,1))
            {
               param1.push({
                  "x":_loc3_,
                  "y":param2.mapY - 1
               });
            }
            if(this.canPlaceRoom(_loc3_,param2.mapY + param2.mapH,1,1))
            {
               param1.push({
                  "x":_loc3_,
                  "y":param2.mapY + param2.mapH
               });
            }
            _loc3_++;
         }
         var _loc4_:int = param2.mapY;
         while(_loc4_ < param2.mapY + param2.mapH)
         {
            if(this.canPlaceRoom(param2.mapX - 1,_loc4_,1,1))
            {
               param1.push({
                  "x":param2.mapX - 1,
                  "y":_loc4_
               });
            }
            if(this.canPlaceRoom(param2.mapX + param2.mapW,_loc4_,1,1))
            {
               param1.push({
                  "x":param2.mapX + param2.mapW,
                  "y":_loc4_
               });
            }
            _loc4_++;
         }
         return param1;
      }

      public function growRoom(param1:int, param2:int) : Room
      {
         var _loc3_:* = 0;
         var _loc4_:* = 1;
         var _loc5_:* = 1;
         while(_loc3_++ < 25 && (_loc4_ < this.currentRegion.maxW || _loc5_ < this.currentRegion.maxH) && FlxG.random() < 0.9)
         {
            switch(int(FlxG.random() * 4))
            {
               case 0:
                  if(_loc5_ < this.currentRegion.maxH && (this.canPlaceRoom(param1,param2 - 1,_loc4_,_loc5_ + 1)))
                  {
                     param2--;
                     _loc5_++;
                  }
                  continue;
               case 1:
                  if(_loc5_ < this.currentRegion.maxH && (this.canPlaceRoom(param1,param2,_loc4_,_loc5_ + 1)))
                  {
                     _loc5_++;
                  }
                  continue;
               case 2:
                  if(_loc4_ < this.currentRegion.maxW && (this.canPlaceRoom(param1 - 1,param2,_loc4_ + 1,_loc5_)))
                  {
                     param1--;
                     _loc4_++;
                  }
                  continue;
               case 3:
                  if(_loc4_ < this.currentRegion.maxW && (this.canPlaceRoom(param1,param2,_loc4_ + 1,_loc5_)))
                  {
                     _loc4_++;
                  }
                  continue;
               default:
                  continue;
            }
         }
         return new Room(param1,param2,_loc4_,_loc5_,this.currentRegion);
      }

      public function canPlaceRoom(param1:int, param2:int, param3:int, param4:int) : Boolean
      {
         return (this.isInBounds(param1,param2,param3,param4)) && !this.anyIsInRoom(param1,param2,param3,param4);
      }

      public function isInBounds(param1:int, param2:int, param3:int, param4:int) : Boolean
      {
         return param1 > 0 && param2 > 0 && param1 + param3 < this.width && param2 + param4 < this.height;
      }

      public function anyIsInRoom(param1:int, param2:int, param3:int, param4:int) : Boolean
      {
         var _loc6_:Room = null;
         var _loc5_:* = 0;
         while(_loc5_ < this.rooms.length)
         {
            _loc6_ = this.rooms[_loc5_];
            if(_loc6_.mapX > param1 + param3 - 1 || _loc6_.mapX + _loc6_.mapW - 1 < param1 || _loc6_.mapY > param2 + param4 - 1 || _loc6_.mapY + _loc6_.mapH - 1 < param2)
            {
               _loc5_++;
               continue;
            }
            return true;
         }
         return false;
      }

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

      public function clearDoorTypes() : void
      {
         var _loc1_:Room = null;
         var _loc2_:Door = null;
         for each(_loc1_ in this.rooms)
         {
            _loc1_.specialType = 0;
            for each(_loc2_ in _loc1_.doors)
            {
               _loc2_.doorType = 0;
            }
         }
      }

      public function assignDoorTypes() : void
      {
         var _loc5_:Door = null;
         var _loc6_:Array = null;
         var _loc7_:Region = null;
         var _loc8_:Room = null;
         var _loc9_:Room = null;
         var _loc10_:Region = null;
         var _loc1_:Array = new Array();
         var _loc2_:Array = new Array();
         var _loc3_:Array = new Array();
         _loc3_.push(this.regions[0]);
         var _loc4_:* = 0;
         while(_loc3_.length > 0)
         {
            _loc4_++;
            _loc6_ = new Array();
            _loc7_ = _loc3_.shift();
            _loc2_.push(_loc7_);
            _loc8_ = FlxG.getRandom(_loc7_.rooms) as Room;
            _loc8_.specialType = _loc4_;
            for each(_loc9_ in _loc7_.rooms)
            {
               for each(_loc5_ in _loc9_.doors)
               {
                  _loc10_ = _loc5_.other(_loc9_).region;
                  if(_loc10_ != _loc7_)
                  {
                     if(_loc5_.doorType <= 0)
                     {
                        if(_loc6_.indexOf(_loc10_) >= 0)
                        {
                           _loc1_.push(_loc5_);
                        }
                        else
                        {
                           _loc5_.doorType = _loc4_;
                           _loc6_.push(_loc10_);
                           if(_loc2_.indexOf(_loc10_) == -1 && _loc3_.indexOf(_loc10_) == -1)
                           {
                              _loc3_.push(_loc10_);
                           }
                        }
                     }
                  }
               }
            }
         }
         for each(_loc5_ in _loc1_)
         {
            if(_loc5_.doorType <= 0)
            {
               _loc5_.doorType = int(FlxG.random() * _loc4_) + 1;
            }
         }
      }
   }
}
