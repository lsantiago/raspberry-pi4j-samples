package weatherstation.logger;

import nmea.api.NMEAParser;
import org.json.JSONObject;
import nmea.parser.StringGenerator;
import weatherstation.logger.servers.TCPServer;

/**
 * Compatible with OpenCPN, NodeRED, NMEA.multiplexer, etc...
 *
 * Expect -Dtcp.port to override default 7001.
 */

public class NMEAOverTCPLogger implements LoggerInterface {

	private int tcpPort = 7001;
	private boolean verbose = true; // TODO Make this a system variable
	private TCPServer tcpServer = null;

	private final String DEVICE_PREFIX = "WS";

	public NMEAOverTCPLogger() {
		try {
			tcpPort = Integer.parseInt(System.getProperty("tcp.port", String.valueOf(tcpPort)));
		} catch (Exception ex) {
			System.err.println(ex.toString());
		}
		// Open TCP port here
		try {
			tcpServer = new TCPServer(this.tcpPort);
		} catch (Exception ex) {
			// Oops
			ex.printStackTrace();
		}
	}

	@Override
	public void pushMessage(JSONObject json)
			throws Exception {
		System.out.println(">>> Logging:\n" + json.toString(2)); // TODO Implement!

		convertAndPush(json);
	}

	/**
	 * TODO Add position (RMC), TWS, TWD.
	 *
	 * @param json
	 */
	private void convertAndPush(JSONObject json) {

		double hum    = json.getDouble("hum");
		double volts  = json.getDouble("volts");
		double dir    = json.getDouble("dir");
		double avgdir = json.getDouble("avgdir");
		double speed  = json.getDouble("speed");
		double gust   = json.getDouble("gust");
		double rain   = json.getDouble("rain");
		double press  = json.getDouble("press");
		double temp   = json.getDouble("temp");

		int deviceIdx = 0; // Instead of "BME280" or so...
		String nmeaXDR = StringGenerator.generateXDR(DEVICE_PREFIX,
				new StringGenerator.XDRElement(StringGenerator.XDRTypes.HUMIDITY,
						hum,
						String.valueOf(deviceIdx++)), // %, Humidity
				new StringGenerator.XDRElement(StringGenerator.XDRTypes.TEMPERATURE,
						temp,
						String.valueOf(deviceIdx++)), // Celcius, Temperature
				new StringGenerator.XDRElement(StringGenerator.XDRTypes.TEMPERATURE,
						temp,
						String.valueOf(deviceIdx++)), // mm/h, Rain
				new StringGenerator.XDRElement(StringGenerator.XDRTypes.GENERIC, // In lack of a better category...
						rain,
						String.valueOf(deviceIdx++))); // Pascal, pressure
		nmeaXDR += NMEAParser.NMEA_SENTENCE_SEPARATOR;

		if (verbose) {
			System.out.println(String.format(">>> Generated [%s]", nmeaXDR.trim()));
		}

		tcpServer.write(nmeaXDR.getBytes());

		String nmeaMDA = StringGenerator.generateMDA(DEVICE_PREFIX,
				press / 100,
				temp,
				-Double.MAX_VALUE,  // Water Temp
				hum,
				-Double.MAX_VALUE,  // Abs hum
				-Double.MAX_VALUE,  // dew point
				avgdir,  // TWD
				-Double.MAX_VALUE,  // TWD (mag)
				speed); // TWS
		nmeaMDA += NMEAParser.NMEA_SENTENCE_SEPARATOR;

		if (verbose) {
			System.out.println(String.format(">>> Generated [%s]", nmeaMDA.trim()));
		}

		tcpServer.write(nmeaMDA.getBytes());

		String nmeaMTA = StringGenerator.generateMTA(DEVICE_PREFIX, temp);
		nmeaMTA += NMEAParser.NMEA_SENTENCE_SEPARATOR;

		if (verbose) {
			System.out.println(String.format(">>> Generated [%s]", nmeaMTA.trim()));
		}

		tcpServer.write(nmeaMTA.getBytes());

		String nmeaMMB = StringGenerator.generateMMB(DEVICE_PREFIX, press / 100);
		nmeaMMB += NMEAParser.NMEA_SENTENCE_SEPARATOR;

		if (verbose) {
			System.out.println(String.format(">>> Generated [%s]", nmeaMMB.trim()));
		}

		tcpServer.write(nmeaMMB.getBytes());

	}
}
