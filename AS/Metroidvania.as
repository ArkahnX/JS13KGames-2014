package
{
   import org.flixel.FlxGame;

   public class Metroidvania extends FlxGame
   {

      public function Metroidvania()
      {
         super(16 * 8 * 5,16 * 8 * 3,PlayState,1);
         forceDebugger = true;
      }
   }
}
