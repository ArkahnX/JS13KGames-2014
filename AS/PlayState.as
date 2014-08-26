package
{
   import org.flixel.*;

   public class PlayState extends FlxState
   {

      public function PlayState()
      {
         this.regionColors = new Array();
         super();
      }

      private var maker:WorldMaker;

      private var mapImage:WorldMapViewer;

      private var feedback:FlxText;

      private var drawFrontiers:Boolean;

      private var currentRegionColorIndex:int;

      private var regionColors:Array;

      override public function create() : void
      {
         FlxG.debug = true;
         FlxG.framerate = 50;
         FlxG.flashFramerate = 50;
         this.currentRegionColorIndex = 0;
         var _loc1_:* = 36;
         while(_loc1_ < 360)
         {
            this.regionColors.push(FlxU.makeColorFromHSB((_loc1_ + 164) % 360,0.9,0.5));
            _loc1_ = _loc1_ + 36;
         }
         this.drawFrontiers = false;
         this.maker = new WorldMaker(80,48);
         this.maker.startAt(40,24,this.nextRegion());
         this.maker.createRooms(9);
         this.mapImage = new WorldMapViewer(this.maker);
         add(this.mapImage);
         add(new FlxText(0,4,this.mapImage.width,"Metroidvania world map"));
         this.feedback = new FlxText(0,20,this.mapImage.width,"");
         add(this.feedback);
         add(new FlxText(0,this.mapImage.height - 20,this.mapImage.width,"Press [a] to add a room,[f] to show or hide frontiers, [r] to add a new region, or [d] to assign doors."));
         this.updateFeedbackLabel();
      }

      public function nextRegion() : Region
      {
         var _loc1_:Region = new Region(this.regionColors[this.currentRegionColorIndex],int(FlxG.random() * 3) + int(FlxG.random() * 3) + 1,int(FlxG.random() * 3) + int(FlxG.random() * 3) + 1);
         this.currentRegionColorIndex = (this.currentRegionColorIndex + 1) % this.regionColors.length;
         return _loc1_;
      }

      public function updateFeedbackLabel() : void
      {
         this.feedback.text = this.maker.rooms.length + " rooms";
      }

      override public function update() : void
      {
         super.update();
         if(FlxG.keys.justPressed("A"))
         {
            this.maker.createRoom();
            this.mapImage.updateImage();
            this.updateFeedbackLabel();
         }
         if(FlxG.keys.justPressed("F"))
         {
            this.mapImage.doDrawFrontiers = !this.mapImage.doDrawFrontiers;
            this.mapImage.updateImage();
         }
         if(FlxG.keys.justPressed("R"))
         {
            this.maker.startNewRegion(this.nextRegion());
            this.mapImage.updateImage();
         }
         if(FlxG.keys.justPressed("D"))
         {
            this.maker.clearDoorTypes();
            this.maker.assignDoorTypes();
            this.mapImage.updateImage();
         }
      }
   }
}
