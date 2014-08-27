package
{
   public class Region extends Object
   {

      public function Region(param1:String, param2:int, param3:int, param4:int)
      {
         super();
         this.name = param1;
         this.color = param2;
         this.maxW = param3;
         this.maxH = param4;
         this.roomNames = new Array();
         this.rooms = new Array();
         this.architectureStyles = new Array();
         this.artStyles = new Array();
         this.roomLootPercent = 0.5;
         this.roomSecretsPercent = 0.5;
         this.roomDoorsPercent = 0.5;
      }

      public var color:int;

      public var maxW:int;

      public var maxH:int;

      public var rooms:Array;

      public var name:String;

      public var roomLootPercent:Number;

      public var roomSecretsPercent:Number;

      public var roomDoorsPercent:Number;

      public var roomNames:Array;

      public var architectureStyles:Array;

      public var artStyles:Array;
   }
}
