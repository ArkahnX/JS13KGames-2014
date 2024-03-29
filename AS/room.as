package
{
   public class Room extends Object
   {

      public function Room(param1:int, param2:int, param3:int, param4:int, param5:Region)
      {
         super();
         this.mapX = param1;
         this.mapY = param2;
         this.mapW = param3;
         this.mapH = param4;
         this.mapColor = 4.281545727E9;
         this.region = param5;
         this.specialType = 0;
         this.isSecret = false;
         this.name = "";
         this.doors = new Array();
         this.architectureStyles = new Array();
         this.artStyles = new Array();
      }

      public var mapX:int;

      public var mapY:int;

      public var mapW:int;

      public var mapH:int;

      public var mapColor:int;

      public var localSeed:int;

      public var doors:Array;

      public var region:Region;

      public var specialType:int;

      public var isSecret:Boolean;

      public var name:String;

      public var architectureStyles:Array;

      public var artStyles:Array;
   }
}
