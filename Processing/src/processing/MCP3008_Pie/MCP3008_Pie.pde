import analogdigitalconverter.mcp3008.MCP3008Reader;
import com.pi4j.io.gpio.Pin;
import utils.PinUtil;
/*
 * Using Sketch > Add File..., select ADC/build/libs/ADC-1.0-all.jar 
 */

boolean SIMULATION = true;
int incSign = 1;
int value = 0;
int ADC_CHANNEL = MCP3008Reader.MCP3008_input_channels.CH0.ch(); // Between 0 and 7, 8 channels on the MCP3008

void setup() {
  size(400, 400); 
  stroke(255);
  noFill();
  textSize(72);  
  if (!SIMULATION) {
    Pin miso = PinUtil.GPIOPin.GPIO_13.pin();
    Pin mosi = PinUtil.GPIOPin.GPIO_12.pin();
    Pin clk  = PinUtil.GPIOPin.GPIO_14.pin();
    Pin cs   = PinUtil.GPIOPin.GPIO_10.pin();

    MCP3008Reader.initMCP3008(miso, mosi, clk, cs);
  }
}

void draw() { // Draw the value of the ADC (MCP3008) at each repaint
  background(0);
  
  if (SIMULATION) {
//  value = (int)Math.floor(1023 * Math.random());  // Simulation
    value += (1 * incSign);
    if (value > 1023) {
      value = 1023;
      incSign = -1;
    } else if (value < 0) {
      value = 0;
      incSign = 1;
    }
  } else {
    value = MCP3008Reader.readMCP3008(ADC_CHANNEL); // Real stuff
  }
  fill(128);
  arc(width/2, height/2, 200, 200, (float)-Math.PI/2, (float)(-Math.PI/2) + radians(360 * value / 1023));
  fill(255);
  text(String.format("%04d", value), 10, 75);
}

void dispose() {
  println("Bye!");
  if (!SIMULATION) {
    MCP3008Reader.shutdownMCP3008();
  }
}