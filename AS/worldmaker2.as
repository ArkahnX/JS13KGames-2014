package
{
   import org.flixel.*;

   public class WorldMaker extends Object
   {

      public function WorldMaker(param1:int, param2:int)
      {
         var _loc4_:* = 0;
         var _loc5_:* = 0;
         var _loc6_:* = 0;
         var _loc7_:* = 0;
         var _loc8_:* = 0;
         var _loc9_:* = 0;
         super();
         this.width = param1;
         this.height = param2;
         this.rooms = new Array();
         this.frontiers = new Array();
         this.restricted = new Array();
         this.regions = new Array();
         this.keyIndex = -1;
         var _loc3_:* = 0;
         while(_loc3_ < param1 * param2 * 0.05)
         {
            _loc4_ = int(FlxG.random() * 8) + 1;
            _loc5_ = int(FlxG.random() * 2) + 1;
            _loc6_ = int(FlxG.random() * param1 - _loc4_);
            _loc7_ = int(FlxG.random() * param2 - _loc5_);
            _loc8_ = 0;
            while(_loc8_ < _loc4_)
            {
               _loc9_ = 0;
               while(_loc9_ < _loc5_)
               {
                  this.restricted.push({
                     "x":_loc6_ + _loc8_,
                     "y":_loc7_ + _loc9_
                  });
                  _loc9_++;
               }
               _loc8_++;
            }
            _loc3_++;
         }
      }

      public var width:int;

      public var height:int;

      public var rooms:Array;

      public var frontiers:Array;

      public var restricted:Array;

      public var currentRegion:Region;

      public var regions:Array;

      public var keyIndex:int;

      public function startAt(param1:int, param2:int, param3:Region) : void
      {
         this.keyIndex++;
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

      public function getFrontiersForRegion(param1:Region) : Array
      {
         var _loc3_:Room = null;
         var _loc2_:Array = new Array();
         for each(_loc3_ in param1.rooms)
         {
            _loc2_ = this.addBorderingFrontiers(_loc2_,_loc3_);
         }
         return _loc2_;
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
         var _loc3_:* = 0;
         var _loc4_:Door = null;
         var _loc2_:* = false;
         while(this.rooms.length > 1 && !_loc2_)
         {
            _loc3_ = 0;
            _loc3_ = _loc3_ + this.addDoorsAlongNorthWall(param1);
            _loc3_ = _loc3_ + this.addDoorsAlongSouthWall(param1);
            _loc3_ = _loc3_ + this.addDoorsAlongWestWall(param1);
            _loc3_ = _loc3_ + this.addDoorsAlongEastWall(param1);
            if(param1.region.rooms.length == 1 && _loc3_ > 0)
            {
               _loc2_ = true;
            }
            for each(_loc4_ in param1.doors)
            {
               if(_loc4_.other(param1).region == param1.region)
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
            if(!(_loc6_ == null) && !_loc6_.isSecret)
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
            if(!(FlxG.random() > this.currentRegion.roomDoorsPercent / 4 || param1.doors.indexOf(_loc5_) >= 0))
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
            if(!(_loc6_ == null) && !_loc6_.isSecret)
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
            if(!(FlxG.random() > this.currentRegion.roomDoorsPercent / 4 || param1.doors.indexOf(_loc5_) >= 0))
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
            if(!(_loc6_ == null) && !_loc6_.isSecret)
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
            if(!(FlxG.random() > this.currentRegion.roomDoorsPercent || param1.doors.indexOf(_loc5_) >= 0))
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
            if(!(_loc6_ == null) && !_loc6_.isSecret)
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
            if(!(FlxG.random() > this.currentRegion.roomDoorsPercent || param1.doors.indexOf(_loc5_) >= 0))
            {
               _loc7_ = new Door(_loc5_.x,_loc5_.y,"E",param1,_loc5_.other);
               param1.doors.push(_loc7_);
               _loc5_.other.doors.push(_loc7_);
               _loc4_++;
            }
         }
         return _loc4_;
      }

      public function growRooms(param1:int) : void
      {
         var _loc2_:* = 0;
         var _loc3_:int = this.rooms.length;
         var _loc4_:* = 0;
         while(_loc2_++ < param1 + 2 && _loc4_ < param1)
         {
            this.createRoom();
            if(_loc3_ < this.rooms.length)
            {
               _loc4_ = _loc4_ + this.rooms[this.rooms.length - 1].mapW * this.rooms[this.rooms.length - 1].mapH;
               _loc3_++;
            }
         }
      }

      public function createRooms(param1:int) : void
      {
         var _loc2_:* = 0;
         var _loc3_:int = this.rooms.length;
         while(_loc2_++ < param1 + 2 && this.rooms.length < _loc3_ + param1)
         {
            this.createRoom();
         }
      }

      public function createRoom() : void
      {
         if(this.frontiers.length == 0)
         {
            return;
         }
         var _loc1_:Object = FlxG.getRandom(this.frontiers);
         var _loc2_:Room = this.growRoom(_loc1_.x,_loc1_.y);
         this.addRoom(_loc2_);
         this.addSecretRooms(_loc2_);
      }

      public function addRoom(param1:Room) : void
      {
         if(param1 == null)
         {
            return;
         }
         param1.mapColor = this.currentRegion.color;
         this.rooms.push(param1);
         this.currentRegion.rooms.push(param1);
         this.frontiers = this.getFrontiersForRegion(this.currentRegion);
         this.addDoors(param1);
         param1.localSeed = FlxG.globalSeed;
         param1.architectureStyles.push(FlxG.getRandom(this.currentRegion.architectureStyles));
         param1.architectureStyles.push(FlxG.getRandom(this.currentRegion.architectureStyles));
         param1.artStyles.push(FlxG.getRandom(this.currentRegion.artStyles));
         param1.artStyles.push(FlxG.getRandom(this.currentRegion.artStyles));
      }

      public function addBorderingFrontiers(param1:Array, param2:Room) : Array
      {
         if(param2.isSecret)
         {
            return param1;
         }
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
         while(_loc3_++ < 36 && (_loc4_ < this.currentRegion.maxW || _loc5_ < this.currentRegion.maxH) && FlxG.random() < 0.9)
         {
            switch(int(FlxG.random() * 6))
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
               case 3:
                  if(_loc4_ < this.currentRegion.maxW && (this.canPlaceRoom(param1 - 1,param2,_loc4_ + 1,_loc5_)))
                  {
                     param1--;
                     _loc4_++;
                  }
                  continue;
               case 4:
               case 5:
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
         return (this.isInBounds(param1,param2,param3,param4)) && !this.anyIsInRoom(param1,param2,param3,param4) && !this.isRestricted(param1,param2,param3,param4);
      }

      public function isInBounds(param1:int, param2:int, param3:int, param4:int) : Boolean
      {
         return param1 > 0 && param2 > 0 && param1 + param3 < this.width && param2 + param4 < this.height;
      }

      public function isRestricted(param1:int, param2:int, param3:int, param4:int) : Boolean
      {
         var _loc5_:Object = null;
         for each(_loc5_ in this.restricted)
         {
            if(param1 > _loc5_.x || param1 + param3 - 1 < _loc5_.x || param2 > _loc5_.y || param2 + param4 - 1 < _loc5_.y)
            {
               continue;
            }
            return true;
         }
         return false;
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

      public function getNonSecretRooms(param1:Region) : Array
      {
         var _loc3_:Room = null;
         var _loc2_:Array = new Array();
         for each(_loc3_ in param1.rooms)
         {
            if(!_loc3_.isSecret)
            {
               _loc2_.push(_loc3_);
            }
         }
         return _loc2_;
      }

      public function addSpecialItemsToDeadEnds() : void
      {
         var _loc1_:Room = null;
         for each(_loc1_ in this.rooms)
         {
            if(!(_loc1_.doors.length > 1 || _loc1_.doors[0].doorType > 0 || _loc1_.specialType > 0 || (_loc1_.isSecret)))
            {
               _loc1_.doors[0].doorType = int(FlxG.random() * this.regions.length + 1);
               _loc1_.specialType = 48 + int(FlxG.random() * 10) + 1;
            }
         }
      }

      public function addSecretRooms(param1:Room) : void
      {
         if(FlxG.random() > this.currentRegion.roomSecretsPercent)
         {
            return;
         }
         var _loc2_:Array = new Array();
         _loc2_ = this.addBorderingFrontiers(_loc2_,param1);
         if(_loc2_.length == 0)
         {
            return;
         }
         var _loc3_:Object = FlxG.getRandom(_loc2_);
         var _loc4_:Room = new Room(_loc3_.x,_loc3_.y,1,1,this.currentRegion);
         _loc4_.isSecret = true;
         _loc4_.specialType = 48 + int(FlxG.random() * 10) + 1;
         this.addRoom(_loc4_);
      }

      public function addRoomLoot(param1:Room) : void
      {
         if(FlxG.random() > this.currentRegion.roomLootPercent)
         {
            param1.specialType = 0;
         }
         else
         {
            param1.specialType = 48 + int(FlxG.random() * 10) + 1;
         }
      }

      public function addRoomName(param1:Room) : void
      {
         if(FlxG.random() > 0.2)
         {
            param1.name = "";
         }
         else
         {
            param1.name = FlxG.getRandom(this.currentRegion.roomNames) as String;
         }
      }

      public function addSpecials() : void
      {
      }

      public function clearDoorTypes() : void
      {
         var _loc1_:Room = null;
         var _loc2_:Door = null;
         for each(_loc1_ in this.rooms)
         {
            for each(_loc2_ in _loc1_.doors)
            {
               _loc2_.doorType = 0;
            }
         }
      }

      public function addKeysToRegion(param1:Region) : void
      {
         var _loc2_:Room = FlxG.getRandom(this.getNonSecretRooms(param1)) as Room;
         _loc2_.specialType = 16 + this.keyIndex;
      }

      public function assignDoorTypes() : void
      {
         var _loc4_:Region = null;
         var _loc5_:Array = null;
         var _loc6_:Room = null;
         var _loc7_:String = null;
         var _loc8_:Door = null;
         var _loc9_:Region = null;
         var _loc10_:Array = null;
         var _loc1_:Array = new Array();
         var _loc2_:Array = new Array();
         var _loc3_:Array = new Array();
         _loc3_.push(this.regions[0]);
         while(_loc3_.length > 0)
         {
            this.keyIndex++;
            _loc4_ = _loc3_.shift();
            _loc2_.push(_loc4_);
            _loc5_ = new Array();
            for each(_loc6_ in _loc4_.rooms)
            {
               if(!_loc6_.isSecret)
               {
                  this.addRoomName(_loc6_);
                  this.addRoomLoot(_loc6_);
                  for each(_loc8_ in _loc6_.doors)
                  {
                     _loc9_ = _loc8_.other(_loc6_).region;
                     if(_loc9_ != _loc4_)
                     {
                        _loc8_.doorType = this.keyIndex + int(FlxG.random() * (this.keyIndex - this.regions.length));
                        if(_loc5_.indexOf(_loc9_.name) == -1)
                        {
                           _loc5_[_loc9_.name] = new Array();
                        }
                        _loc5_[_loc9_.name].push(_loc8_);
                        if(_loc2_.indexOf(_loc9_) == -1 && _loc3_.indexOf(_loc9_) == -1)
                        {
                           _loc3_.push(_loc9_);
                        }
                     }
                  }
               }
            }
            this.addKeysToRegion(_loc4_);
            for(_loc7_ in _loc5_)
            {
               _loc10_ = _loc5_[_loc7_];
               FlxG.getRandom(_loc10_).doorType = this.keyIndex - 1;
            }
         }
      }

      public function getWorld() : World
      {
         var _loc1_:World = new World(this.width,this.height);
         _loc1_.regions = this.regions;
         _loc1_.rooms = this.rooms;
         return _loc1_;
      }
   }
}
