package
{
   import org.flixel.FlxSprite;

   public class WorldMapViewer extends FlxSprite
   {

      public function WorldMapViewer(param1:World)
      {
         super();
         this.world = param1;
         makeGraphic(param1.width * Globals.mapScreenWidth,param1.height * Globals.mapScreenHeight,4.281545523E9);
         this.updateImage();
      }

      public var world:World;

      public function updateImage() : void
      {
         fill(4.281545523E9);
         this.drawMap();
      }

      public function drawMap() : void
      {
         var _loc1_:Room = null;
         var _loc2_:FlxSprite = null;
         for each(_loc1_ in this.world.rooms)
         {
            _loc2_ = new FlxSprite().makeGraphic(_loc1_.mapW * Globals.mapScreenWidth,_loc1_.mapH * Globals.mapScreenHeight,_loc1_.isSecret?4.281545523E9:_loc1_.mapColor);
            stamp(_loc2_,_loc1_.mapX * Globals.mapScreenWidth,_loc1_.mapY * Globals.mapScreenHeight);
            this.drawRectangle(_loc1_);
            this.drawDoors(_loc1_);
         }
      }

      public function drawRectangle(param1:Room) : void
      {
         var _loc2_:int = 4.293848831E9;
         drawLine(Globals.mapScreenWidth * param1.mapX,Globals.mapScreenHeight * param1.mapY,Globals.mapScreenWidth * param1.mapX + Globals.mapScreenWidth * param1.mapW,Globals.mapScreenHeight * param1.mapY,_loc2_);
         drawLine(Globals.mapScreenWidth * param1.mapX,Globals.mapScreenHeight * param1.mapY,Globals.mapScreenWidth * param1.mapX,Globals.mapScreenHeight * param1.mapY + Globals.mapScreenHeight * param1.mapH,_loc2_);
         drawLine(Globals.mapScreenWidth * param1.mapX + Globals.mapScreenWidth * param1.mapW,Globals.mapScreenHeight * param1.mapY,Globals.mapScreenWidth * param1.mapX + Globals.mapScreenWidth * param1.mapW,Globals.mapScreenHeight * param1.mapY + Globals.mapScreenHeight * param1.mapH,_loc2_);
         drawLine(Globals.mapScreenWidth * param1.mapX,Globals.mapScreenHeight * param1.mapY + Globals.mapScreenHeight * param1.mapH,Globals.mapScreenWidth * param1.mapX + Globals.mapScreenWidth * param1.mapW + 1,Globals.mapScreenHeight * param1.mapY + Globals.mapScreenHeight * param1.mapH,_loc2_);
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
                  drawLine(Globals.mapScreenWidth * _loc4_.mapX + _loc3_,Globals.mapScreenHeight * _loc4_.mapY,Globals.mapScreenWidth * _loc4_.mapX + Globals.mapScreenWidth - _loc3_,Globals.mapScreenHeight * _loc4_.mapY,_loc2_);
                  continue;
               case "S":
                  drawLine(Globals.mapScreenWidth * _loc4_.mapX + _loc3_,Globals.mapScreenHeight * (_loc4_.mapY + 1),Globals.mapScreenWidth * _loc4_.mapX + Globals.mapScreenWidth - _loc3_,Globals.mapScreenHeight * (_loc4_.mapY + 1),_loc2_);
                  continue;
               case "W":
                  drawLine(Globals.mapScreenWidth * _loc4_.mapX,Globals.mapScreenHeight * _loc4_.mapY + _loc3_,Globals.mapScreenWidth * _loc4_.mapX,Globals.mapScreenHeight * _loc4_.mapY + Globals.mapScreenHeight - _loc3_,_loc2_);
                  continue;
               case "E":
                  drawLine(Globals.mapScreenWidth * (_loc4_.mapX + 1),Globals.mapScreenHeight * _loc4_.mapY + _loc3_,Globals.mapScreenWidth * (_loc4_.mapX + 1),Globals.mapScreenHeight * _loc4_.mapY + Globals.mapScreenHeight - _loc3_,_loc2_);
                  continue;
               default:
                  continue;
            }
         }
      }

      public function getRoomAt(param1:int, param2:int) : Room
      {
         var _loc3_:Room = null;
         var param1:int = param1 / Globals.mapScreenWidth;
         var param2:int = param2 / Globals.mapScreenHeight;
         for each(_loc3_ in this.world.rooms)
         {
            if(_loc3_.mapX <= param1 && _loc3_.mapX + _loc3_.mapW - 1 >= param1 && _loc3_.mapY <= param2 && _loc3_.mapY + _loc3_.mapH - 1 >= param2)
            {
               return _loc3_;
            }
         }
         return null;
      }
   }
}
