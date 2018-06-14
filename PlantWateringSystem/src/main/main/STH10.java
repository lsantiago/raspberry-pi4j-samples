package main;

import com.pi4j.io.gpio.PinState;
import relay.RelayDriver;
import sensors.sth10.STH10Driver;
import utils.PinUtil;
import utils.StaticUtil;
import utils.WeatherUtil;

import java.util.Arrays;
import java.util.function.Supplier;

import static utils.TimeUtil.fmtDHMS;
import static utils.TimeUtil.msToHMS;

/**
 * Example / Prototype...
 */
public class STH10 {

	private static boolean go = true;

	private final static int HUMIDITY_THRESHOLD = 35; // 35 %
	private final static long WATERING_DURATION = 10L; // 10 seconds
	private final static long RESUME_SENSOR_WATCH_AFTER = 120L; // 2 minutes

	// Program arguments
	private enum ARGUMENTS {
		HUMIDITY_THRESHOLD("--water-below:", // %
				"Integer. Humidity threshold in %, default is --water-below:35, start watering below this value."),
		WATERING_DURATION("--water-during:", // seconds
				"Integer. In seconds, default is --water-during:10. Duration of the watering process."),
		RESUME_AFTER("--resume-after:", // seconds
				"Integer. In seconds, default is --resume-after:120. After watering, resume sensor monitoring after this amount of time."),
		VERBOSE("--verbose:", // true|false
				"Boolean. Verbose, default is --verbose:false, values can be 'true' or something else."),
		DATA_PIN("--data-pin:", // default is BCM 18 => GPIO_01
				"Integer. BCM (aka GPIO) pin number of the DATA pin of the sensor. Default is --data-pin:18."),
		CLOCK_PIN("--clock-pin:", // default is BCM 23 => GPIO_04
				"Integer. BCM (aka GPIO) pin number of the CLOCK pin of the sensor. Default is --clock-pin:23."),
		RELAY_PIN("--relay-pin:",  // default is BCM 17 => GPIO_00
				"Integer. BCM (aka GPIO) pin number of the SIGNAL pin of the RELAY. Default is --relay-pin:17."),
		HELP("--help", "Display the help and exit.");

		private String prefix, help;

		ARGUMENTS(String prefix, String help) {
			this.prefix = prefix;
			this.help = help;
		}

		public String prefix() {
			return this.prefix;
		}
		public String help() {
			return this.help;
		}
	}

	private static boolean verbose = false;

	private static STH10Driver probe = null;
	private static RelayDriver relay = null;

	// Simulators, to run on non-Raspberry PIs - for development.
	private static Supplier<Double> temperatureSimulator = STH10::simulateUserTemp; // STH10::simulateTemp;
	private static Supplier<Double> humiditySimulator = STH10::simulateUserHum;     // STH10::simulateHum;

	private static double siumlatedTemperature = 20d;
	private static double siumlatedHumidity = 50d;

	private static double minSimTemp = siumlatedTemperature, maxSimTemp = siumlatedTemperature;
	private static double minSimHum = siumlatedHumidity, maxSimHum = siumlatedHumidity;

	private static Double simulateTemp() {
		int sign = (int)System.currentTimeMillis() % 2;
		double diff = Math.random() * (sign == 0 ? 1 : -1);
		siumlatedTemperature += diff;
		minSimTemp = Math.min(minSimTemp, siumlatedTemperature);
		maxSimTemp = Math.max(maxSimTemp, siumlatedTemperature);
		return siumlatedTemperature;
	}
	private static Double simulateHum() {
		int sign = (int)System.currentTimeMillis() % 2;
		double diff = Math.random() * (sign == 0 ? 1 : -1);
		siumlatedHumidity += diff;
		minSimHum = Math.min(minSimHum, siumlatedHumidity);
		maxSimHum = Math.max(maxSimHum, siumlatedHumidity);
		return siumlatedHumidity;
	}

	// Interactive simulators, for dev and tests.
	private static Double simulateUserTemp() {
		return siumlatedTemperature;
	}
	private static Double simulateUserHum() {
		return siumlatedHumidity;
	}

	private static void parseUserInput(String str) {
		// Input can be T:XX or H:xx
		if (str.startsWith("T:")) {
			try {
				siumlatedTemperature = Double.parseDouble(str.substring("T:".length()));
			} catch (NumberFormatException nfe) {
				nfe.printStackTrace();
			}
		} else if (str.startsWith("H:")) {
			try {
				siumlatedHumidity = Double.parseDouble(str.substring("H:".length()));
			} catch (NumberFormatException nfe) {
				nfe.printStackTrace();
			}
		}
	}

	public static void main(String... args) {

		// Default values
		int humidityThreshold = HUMIDITY_THRESHOLD;
		long wateringDuration = WATERING_DURATION;
		long resumeSensorWatchAfter = RESUME_SENSOR_WATCH_AFTER;

		int dataPin = 18, clockPin = 23, relayPin = 17; // Defaults

		// Override values with runtime arguments
		for (String arg : args) {
			if (arg.startsWith(ARGUMENTS.HELP.prefix())) {
				// No value, display help
				System.out.println("+---------------------------------------");
				System.out.println("| Program arguments are:");
				System.out.println("+---------------------------------------");
				Arrays.stream(ARGUMENTS.values()).forEach(argument -> System.out.println("| " +argument.prefix() + "\t" + argument.help()));
				System.out.println("+---------------------------------------");
				System.exit(0);
			} else if (arg.startsWith(ARGUMENTS.VERBOSE.prefix())) {
				String val = arg.substring(ARGUMENTS.VERBOSE.prefix().length());
				verbose = "true".equals(val);
			} else if (arg.startsWith(ARGUMENTS.DATA_PIN.prefix())) {
				String val = arg.substring(ARGUMENTS.DATA_PIN.prefix().length());
				try {
					dataPin = Integer.parseInt(val);
				} catch (NumberFormatException nfe) {
					nfe.printStackTrace();
				}
			} else if (arg.startsWith(ARGUMENTS.CLOCK_PIN.prefix())) {
				String val = arg.substring(ARGUMENTS.CLOCK_PIN.prefix().length());
				try {
					clockPin = Integer.parseInt(val);
				} catch (NumberFormatException nfe) {
					nfe.printStackTrace();
				}
			} else if (arg.startsWith(ARGUMENTS.RELAY_PIN.prefix())) {
				String val = arg.substring(ARGUMENTS.RELAY_PIN.prefix().length());
				try {
					relayPin = Integer.parseInt(val);
				} catch (NumberFormatException nfe) {
					nfe.printStackTrace();
				}
			} else if (arg.startsWith(ARGUMENTS.HUMIDITY_THRESHOLD.prefix())) {
				String val = arg.substring(ARGUMENTS.HUMIDITY_THRESHOLD.prefix().length());
				try {
					humidityThreshold = Integer.parseInt(val);
					if (humidityThreshold < 0 || humidityThreshold > 100) {
						humidityThreshold = HUMIDITY_THRESHOLD;
						System.err.println(String.format(">> Humidity Threshold must be in [0..100]. Reseting to %d ", HUMIDITY_THRESHOLD));
					}
				} catch (NumberFormatException nfe) {
					nfe.printStackTrace();
				}
			} else if (arg.startsWith(ARGUMENTS.WATERING_DURATION.prefix())) {
				String val = arg.substring(ARGUMENTS.WATERING_DURATION.prefix().length());
				try {
					wateringDuration = Long.parseLong(val);
					if (wateringDuration < 0) {
						wateringDuration = WATERING_DURATION;
						System.err.println(">> Watering duration must be positive. Ignoring.");
					}
				} catch (NumberFormatException nfe) {
					nfe.printStackTrace();
				}
			} else if (arg.startsWith(ARGUMENTS.RESUME_AFTER.prefix())) {
				String val = arg.substring(ARGUMENTS.RESUME_AFTER.prefix().length());
				try {
					resumeSensorWatchAfter = Long.parseLong(val);
					if (resumeSensorWatchAfter < 0) {
						resumeSensorWatchAfter = RESUME_SENSOR_WATCH_AFTER;
						System.err.println(">> Resume Watch After must be positive. Ignoring.");
					}
				} catch (NumberFormatException nfe) {
					nfe.printStackTrace();
				}
			}
		}
		// Print summary
		System.out.println("+------- P L A N T   W A T E R I N G   S Y S T E M --------");
		System.out.println(String.format("| Start watering under %d%% of humidity.", humidityThreshold));
		System.out.println(String.format("| Water during %s", fmtDHMS(msToHMS(wateringDuration * 1_000))));
		System.out.println(String.format("| Resume sensor watch %s after watering.", fmtDHMS(msToHMS(resumeSensorWatchAfter * 1_000))));
		System.out.println("+----------------------------------------------------------");

		if (verbose) {
			System.out.println("Wiring:");
			// Compose mapping for PinUtil, physical numbers.
			String[] map = new String[3];
			map[0] = String.valueOf(PinUtil.findByPin(PinUtil.getPinByGPIONumber(dataPin)).pinNumber()) + ":" + "DATA";
			map[1] = String.valueOf(PinUtil.findByPin(PinUtil.getPinByGPIONumber(clockPin)).pinNumber()) + ":" + "CLOCK";
			map[2] = String.valueOf(PinUtil.findByPin(PinUtil.getPinByGPIONumber(relayPin)).pinNumber()) + ":" + "RELAY";
			PinUtil.print(map);
		}

		try {
			probe = new STH10Driver(PinUtil.getPinByGPIONumber(dataPin), PinUtil.getPinByGPIONumber(clockPin));
			if (probe.isSimulating()) {
				// Provide simulator here
				System.out.println(">> Will simulate STH10");
				probe.setSimulators(temperatureSimulator, humiditySimulator);
			}
	  } catch (UnsatisfiedLinkError ule) { // That one is trapped in the constructor of STH10Driver.
			System.out.println("You're not on a Raspberry PI, or your wiring is wrong.");
			System.out.println("Exiting.");
			System.exit(1);
		}
		try {
			relay = new RelayDriver(PinUtil.getPinByGPIONumber(relayPin));
			if (relay.isSimulating()) {
				// Provide simulator here
				System.out.println(">> Will simulate Relay");
				relay.setSimulator(System.out::println);
			}
		} catch (UnsatisfiedLinkError ule) { // That one is trapped in the constructor of RelayDriver.
			System.out.println("You're not on a Raspberry PI, or your wiring is wrong.");
			System.out.println("Exiting.");
			System.exit(1);
		}

		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			go = false;
			if (relay.getState() == PinState.HIGH) {
				relay.down();
			}
			System.out.println("\nExiting");
			try { Thread.sleep(1_500L); } catch (InterruptedException ie) {
				ie.printStackTrace();
			}
		}));

		// Manual input
		Thread manualThread = new Thread(() -> {
			while (go) {
				String userInput = StaticUtil.userInput(" T:XX, H:XX > ");
				parseUserInput(userInput);
			}
		});
		manualThread.start();

		/*
		 * This is the main loop
		 */
		while (go) {
			double t = probe.readTemperature();
			double h = probe.readHumidity(t);

			// TODO A screen (Like the SSD1306), ANSI Console ?
			System.out.println(String.format("Temp: %.02f C, Hum: %.02f%% (dew pt Temp: %.02f C)", t, h, WeatherUtil.dewPointTemperature(h, t)));

			/*
			 * Here, test the sensor's values, and make the decision about the valve.
			 */
			if (h < humidityThreshold) { // Ah! Need some water
				// Open the valve
				relay.up();
				if (verbose) {
					System.out.println("Watering...");
				}
				// Watering time
				try {
					final Thread mainThread = Thread.currentThread();
					final long _waterDuration = wateringDuration;
					Thread wateringThread = new Thread(() -> {
						for (int i=0; i<_waterDuration; i++) {
							try {
								Thread.sleep(1_000L);
							} catch (InterruptedException ie) {
								ie.printStackTrace();
							}
							// Tick, countdown...
							System.out.println(String.format("\t... %d", (_waterDuration - i)));
						}
						synchronized (mainThread) {
							if (verbose) {
								System.out.println("Ok! Enough water!");
							}
							mainThread.notify(); // Release the wait on main thread.
						}
					}, "watering-thread");
					wateringThread.start();

					synchronized (mainThread) {
						mainThread.wait();
						if (verbose) {
							System.out.println("... back to work.");
						}
					}
					if (verbose) {
						System.out.println("Shutting off the valve.");
					}
				} catch (Exception ex) {
					ex.printStackTrace();
				}
				if (verbose) {
					System.out.println("Done watering.");
				}
				// Shut the valve
				relay.down();
				// Wait before resuming sensor watching
				if (verbose) {
					System.out.println("Napping a bit... Spreading the word...");
				}
				try {
					Thread.sleep(resumeSensorWatchAfter * 1_000L);
				} catch (Exception ex) {
					ex.printStackTrace();
				}
				// Resume watching
			} else {
				try {
					Thread.sleep(1_000L);
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		}

		if (probe.isSimulating()) {
			System.out.println(String.format("Simulated temperature between %.02f and %.02f", minSimTemp, maxSimTemp));
			System.out.println(String.format("Simulated humidity between %.02f and %.02f", minSimHum, maxSimHum));
		}

		probe.shutdownGPIO();
		relay.shutdownGPIO();

		System.out.println("Bye-bye!");
	}
}
