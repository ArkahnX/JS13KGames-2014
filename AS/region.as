package
{
   public class Region extends Object
   {

      public function Region(param1:int, param2:int, param3:int)
      {
         super();
         this.color = param1;
         this.maxW = param2;
         this.maxH = param3;
         this.rooms = new Array();
      }

      public var color:int;

      public var maxW:int;

      public var maxH:int;

      public var rooms:Array;
   }
}
