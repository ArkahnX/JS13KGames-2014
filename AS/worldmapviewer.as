package
{
   import org.flixel.*;

   public class WorldMapViewer extends FlxSprite
   {

      public function WorldMapViewer(param1:WorldMaker)
      {
         this.map_icons = WorldMapViewer_map_icons;
         super();
         this.roomSize = 8;
         this.iconStamp = new FlxSprite();
         this.iconStamp.loadGraphic(this.map_icons,false,false,8,8);
         this.world = param1;
         makeGraphic(param1.width * 8,param1.height * 8,4.281545523E9);
         this.updateImage();
      }

      private var roomSize:int;

      public var world:WorldMaker;

      public var doDrawFrontiers:Boolean;

      public var map_icons:Class;

      private var iconStamp:FlxSprite;

      public function updateImage() : void
      {
         fill(4.281545523E9);
         this.drawMap();
         if(this.doDrawFrontiers)
         {
            this.drawFrontiers();
         }
      }

      public function drawMap() : void
      {
         var _loc1_:Room = null;
         var _loc2_:FlxSprite = null;
         for each(_loc1_ in this.world.rooms)
         {
            _loc2_ = new FlxSprite().makeGraphic(_loc1_.mapW * this.roomSize,_loc1_.mapH * this.roomSize,_loc1_.mapColor);
            stamp(_loc2_,_loc1_.mapX * this.roomSize,_loc1_.mapY * this.roomSize);
            this.drawRectangle(_loc1_);
            this.drawDoors(_loc1_);
         }
         for each(_loc1_ in this.world.rooms)
         {
            this.drawIcons(_loc1_);
         }
      }

      public function drawFrontiers() : void
      {
         var _loc3_:Object = null;
         var _loc1_:FlxSprite = new FlxSprite().makeGraphic(this.roomSize,this.roomSize,4.28825646E9);
         var _loc2_:* = 0;
         while(_loc2_ < this.world.frontiers.length)
         {
            _loc3_ = this.world.frontiers[_loc2_];
            stamp(_loc1_,this.roomSize * _loc3_.x,this.roomSize * _loc3_.y);
            this.drawRectangle(new Room(_loc3_.x,_loc3_.y,1,1,null));
            _loc2_++;
         }
      }

      public function drawRectangle(param1:Room) : void
      {
         var _loc2_:int = 4.293848831E9;
         drawLine(this.roomSize * param1.mapX,this.roomSize * param1.mapY,this.roomSize * param1.mapX + this.roomSize * param1.mapW,this.roomSize * param1.mapY,_loc2_);
         drawLine(this.roomSize * param1.mapX,this.roomSize * param1.mapY,this.roomSize * param1.mapX,this.roomSize * param1.mapY + this.roomSize * param1.mapH,_loc2_);
         drawLine(this.roomSize * param1.mapX + this.roomSize * param1.mapW,this.roomSize * param1.mapY,this.roomSize * param1.mapX + this.roomSize * param1.mapW,this.roomSize * param1.mapY + this.roomSize * param1.mapH,_loc2_);
         drawLine(this.roomSize * param1.mapX,this.roomSize * param1.mapY + this.roomSize * param1.mapH,this.roomSize * param1.mapX + this.roomSize * param1.mapW + 1,this.roomSize * param1.mapY + this.roomSize * param1.mapH,_loc2_);
      }

      public function drawDoors(param1:Room) : void
      {
         var _loc4_:Door = null;
         var _loc2_:int = param1.mapColor;
         var _loc3_:* = 2;
         for each(_loc4_ in param1.doors)
         {
            switch(_loc4_.dir)
            {
               case "N":
                  drawLine(this.roomSize * _loc4_.mapX + _loc3_,this.roomSize * _loc4_.mapY,this.roomSize * _loc4_.mapX + this.roomSize - _loc3_,this.roomSize * _loc4_.mapY,_loc2_);
                  continue;
               case "S":
                  drawLine(this.roomSize * _loc4_.mapX + _loc3_,this.roomSize * (_loc4_.mapY + 1),this.roomSize * _loc4_.mapX + this.roomSize - _loc3_,this.roomSize * (_loc4_.mapY + 1),_loc2_);
                  continue;
               case "W":
                  drawLine(this.roomSize * _loc4_.mapX,this.roomSize * _loc4_.mapY + _loc3_,this.roomSize * _loc4_.mapX,this.roomSize * _loc4_.mapY + this.roomSize - _loc3_,_loc2_);
                  continue;
               case "E":
                  drawLine(this.roomSize * (_loc4_.mapX + 1),this.roomSize * _loc4_.mapY + _loc3_,this.roomSize * (_loc4_.mapX + 1),this.roomSize * _loc4_.mapY + this.roomSize - _loc3_,_loc2_);
                  continue;
               default:
                  continue;
            }
         }
      }

      public function drawIcons(param1:Room) : void
      {
         var _loc4_:Object = null;
         var _loc2_:int = param1.mapColor;
         var _loc3_:int = (this.roomSize - 8) / 2;
         for each(_loc4_ in param1.doors)
         {
            switch(_loc4_.dir)
            {
               case "N":
                  this.iconStamp.frame = 32 + _loc4_.doorType;
                  stamp(this.iconStamp,this.roomSize * _loc4_.mapX,this.roomSize * _loc4_.mapY - 4);
                  continue;
               case "S":
                  this.iconStamp.frame = 32 + _loc4_.doorType;
                  stamp(this.iconStamp,this.roomSize * _loc4_.mapX,this.roomSize * _loc4_.mapY + 4);
                  continue;
               case "W":
                  this.iconStamp.frame = 32 + _loc4_.doorType;
                  stamp(this.iconStamp,this.roomSize * _loc4_.mapX - 4,this.roomSize * _loc4_.mapY);
                  continue;
               case "E":
                  this.iconStamp.frame = 32 + _loc4_.doorType;
                  stamp(this.iconStamp,this.roomSize * _loc4_.mapX + 4,this.roomSize * _loc4_.mapY);
                  continue;
               default:
                  continue;
            }
         }
         this.iconStamp.frame = 16 + param1.specialType;
         stamp(this.iconStamp,this.roomSize * (param1.mapX + param1.mapW / 2) - 4,this.roomSize * (param1.mapY + param1.mapH / 2) - 4);
      }
   }
}
