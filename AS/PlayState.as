package
{
   import org.flixel.*;

   public class PlayState extends FlxState
   {

      public function PlayState(param1:World)
      {
         super();
         this.world = param1;
      }

      private var world:World;

      private var backgroundTilemap:FlxTilemap;

      private var tilemap:FlxTilemap;

      private var player:Player;

      private var viewer:PlayStateViewer;

      override public function create() : void
      {
         FlxG.log("PlayState created");
         if(this.viewer != null)
         {
            this.setCamera();
            return;
         }
         super.create();
         this.backgroundTilemap = new FlxTilemap();
         this.tilemap = new FlxTilemapExt();
         this.player = new Player(8 * 16,5 * 16);
         this.viewer = new PlayStateViewer(this.player,this.tilemap,this.backgroundTilemap);
         add(this.viewer);
         this.viewer.viewRoom(this.world.rooms[0]);
         this.setCamera();
      }

      public function setCamera() : void
      {
         FlxG.camera.follow(this.player,FlxCamera.STYLE_PLATFORMER);
         FlxG.camera.setBounds(0,0,this.tilemap.width,this.tilemap.height,true);
         FlxG.watch(this.viewer,"mapX");
         FlxG.watch(this.viewer,"mapY");
         FlxG.watch(this.player,"x");
         FlxG.watch(this.player,"y");
      }

      private function checkBounds() : void
      {
         var _loc1_:int = this.player.x + this.player.width / 2 + this.viewer.room.mapX * Globals.screenWidthInTiles * 16;
         var _loc2_:int = this.player.y + this.player.height / 2 + this.viewer.room.mapY * Globals.screenHeightInTiles * 16;
         if(_loc1_ + 2 >= this.viewer.room.mapX * Globals.screenWidthInTiles * 16 && _loc2_ + 2 >= this.viewer.room.mapY * Globals.screenHeightInTiles * 16 && _loc1_ - 2 <= (this.viewer.room.mapX + this.viewer.room.mapW) * Globals.screenWidthInTiles * 16 && _loc2_ - 2 <= (this.viewer.room.mapY + this.viewer.room.mapH) * Globals.screenHeightInTiles * 16)
         {
            return;
         }
         var _loc3_:int = Math.floor(_loc1_ / 16 / Globals.screenWidthInTiles);
         var _loc4_:int = Math.floor(_loc2_ / 16 / Globals.screenHeightInTiles);
         var _loc5_:Room = this.world.getRoom(_loc3_,_loc4_);
         if(_loc5_ == null)
         {
            this.stayInRoom(_loc3_,_loc4_,this.viewer.room);
         }
         else
         {
            this.enterRoom(_loc1_,_loc2_,_loc3_,_loc4_,_loc5_);
         }
      }

      private function checkBounds2() : void
      {
         var _loc1_:int = this.player.x + this.player.width / 2 + this.viewer.room.mapX * Globals.screenWidthInTiles * 16;
         var _loc2_:int = this.player.y + this.player.height / 2 + this.viewer.room.mapY * Globals.screenHeightInTiles * 16;
         var _loc3_:int = this.player.x / 16 / Globals.screenWidthInTiles;
         var _loc4_:int = this.player.y / 16 / Globals.screenHeightInTiles;
         if(this.player.x + 32 < this.tilemap.x)
         {
            this.enterRoom2(_loc1_,_loc2_,_loc3_ - 1,_loc4_);
         }
         else if(this.player.x + this.player.width - 32 > this.tilemap.width)
         {
            this.enterRoom2(_loc1_,_loc2_,_loc3_ + 1,_loc4_);
         }

         if(this.player.y + 64 < this.tilemap.y)
         {
            this.enterRoom2(_loc1_,_loc2_,_loc3_,_loc4_ - 1);
         }
         else if(this.player.y + this.player.height - 64 > this.tilemap.height)
         {
            this.enterRoom2(_loc1_,_loc2_,_loc3_,_loc4_ + 1);
         }

      }

      public function stayInRoom(param1:int, param2:int, param3:Room) : void
      {
         FlxG.log("stayInRoom: " + param1 + "x" + param2 + ", " + param3.name);
         if(this.player.x < 0)
         {
            this.player.x = 8;
         }
         else if(this.player.x + this.player.width > param3.mapW * 16 * Globals.screenWidthInTiles)
         {
            this.player.x = param3.mapW * 16 * Globals.screenWidthInTiles - this.player.width - 8;
         }

         if(this.player.y < 0)
         {
            this.player.y = 8;
         }
         else if(this.player.y + this.player.height > param3.mapH * 16 * Globals.screenHeightInTiles)
         {
            this.player.y = param3.mapH * 16 * Globals.screenHeightInTiles - this.player.height - 8;
         }

      }

      public function enterRoom(param1:int, param2:int, param3:int, param4:int, param5:Room) : void
      {
         FlxG.log("enterRoom: " + param3 + "x" + param4 + ", " + param5.region.name + " " + param5.name);
         this.player.x = param1 - this.player.width / 2 - param5.mapX * 16 * Globals.screenWidthInTiles;
         this.player.y = param2 - this.player.height / 2 - param5.mapY * 16 * Globals.screenHeightInTiles;
         this.viewer.viewRoom(param5);
         this.setCamera();
      }

      public function enterRoom2(param1:int, param2:int, param3:int, param4:int) : void
      {
         var _loc5_:Room = this.world.getRoom(param3,param4);
         FlxG.log("enterRoom: " + param3 + "x" + param4 + ", " + _loc5_.region.name + " " + _loc5_.name);
         this.player.x = param1 - _loc5_.mapX * 16 * Globals.screenWidthInTiles - this.player.width / 2;
         this.player.y = param2 - _loc5_.mapY * 16 * Globals.screenHeightInTiles - this.player.height / 2;
         this.viewer.viewRoom(_loc5_);
         this.setCamera();
      }

      override public function destroy() : void
      {
      }

      override public function update() : void
      {
         var _loc1_:MapState = null;
         super.update();
         this.checkBounds();
         FlxG.collide(this.player,this.tilemap);
         if(FlxG.keys.justPressed("M"))
         {
            _loc1_ = new MapState();
            _loc1_.playState = this;
            _loc1_.world = this.world;
            _loc1_.playerX = this.player.x / 16 / Globals.screenWidthInTiles + this.viewer.mapX;
            _loc1_.playerY = this.player.y / 16 / Globals.screenHeightInTiles + this.viewer.mapY;
            FlxG.switchState(_loc1_);
         }
      }
   }
}
