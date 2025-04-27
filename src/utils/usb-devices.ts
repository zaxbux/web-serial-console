interface USBDevice {
	/**
	 * The device ID.
	 */
	id: number,

	/**
	 * The name of the USB device.
	 */
	name: string,
}

interface USBVendor {
	/**
	 * The vendor ID.
	 */
	id: number;

	/**
	 * The name of the USB device vendor.
	 */
	name: string;

	/**
	 * An optional alias to use instead of the name.
	 */
	alias?: string;

	/**
	 * The device IDs that belong to this vendor ID.
	 */
	devices?: Array<USBDevice>;
}

type USBVendorList = Array<USBVendor>;


interface DeviceFilter {
	name: string;
	filters: {
		vid: number;
		pid?: number;
	}[]
}

/**
 * A list of USB vendors and devices for identifying USB devices attached to a serial port.
 */
export const vendors: USBVendorList = [
  {
    id: 0x0403,
    name: 'Future Technology Devices International, Ltd',
    alias: 'FTDI',
    devices: [
      {
        id: 0x6001,
        name: 'FT232R USB UART',
      }
    ],
  },
	{
		id: 0x067b,
		name: 'Prolific Technology, Inc.',
	}, {
		id: 0x10c4,
		name: 'Silicon Labs',
	}, {
		id: 0x2341,
		name: 'Arduino LLC (arduino.cc)',
		alias: 'Arduino',
		devices: [
			{
				id: 0x0001,
				name: 'Uno',
			}, {
				id: 0x0010,
				name: 'Mega 2560',
			}, {
				id: 0x0036,
				name: 'Leonardo Bootloader',
			}, {
				id: 0x003b,
				name: 'Serial Adapter',
			}, {
				id: 0x003d,
				name: 'Due Programming Port',
			}, {
				id: 0x003e,
				name: 'Due',
			}, {
				id: 0x003f,
				name: 'Mega ADK',
			}, {
				id: 0x0042,
				name: 'Mega 2560 R3',
			}, {
				id: 0x0043,
				name: 'Uno R3',
			}, {
				id: 0x0044,
				name: 'Mega ADK R3',
			}, {
				id: 0x0045,
				name: 'Serial R3',
			}, {
				id: 0x0049,
				name: 'ISP',
			}, {
				id: 0x8036,
				name: 'Leonardo',
			}, {
				id: 0x8038,
				name: 'Robot Control Board',
			}, {
				id: 0x8039,
				name: 'Robot Motor Board',
			},
		],
	}, {
		id: 0x2a03,
		name: 'Arduino SA (arduino.org)',
		alias: 'Arduino',
		devices: [
			{
				id: 0x0001,
				name: 'Linino ONE (bootloader)'
			}, {
				id: 0x0036,
				name: 'Leonardo (bootloader)'
			}, {
				id: 0x0037,
				name: 'Micro (bootloader)'
			}, {
				id: 0x003a,
				name: 'Micro ADK rev3 (bootloader)'
			}, {
				id: 0x003b,
				name: '(usb2serial)'
			}, {
				id: 0x003c,
				name: 'Explora (bootloader)'
			}, {
				id: 0x003d,
				name: 'Due (usb2serial)'
			}, {
				id: 0x003e,
				name: 'Due'
			}, {
				id: 0x0041,
				name: 'Yun (bootloader)'
			}, {
				id: 0x0042,
				name: 'Mega 2560 Rev3'
			}, {
				id: 0x0043,
				name: 'Uno Rev3'
			}, {
				id: 0x004d,
				name: 'Zero Pro (bootloader)'
			}, {
				id: 0x8001,
				name: 'Linino ONE'
			}, {
				id: 0x8036,
				name: 'Leonardo'
			}, {
				id: 0x8037,
				name: 'Micro'
			}, {
				id: 0x8038,
				name: 'Robot Control'
			}, {
				id: 0x8039,
				name: 'Robot Motor'
			}, {
				id: 0x803a,
				name: 'Micro ADK rev3'
			}, {
				id: 0x803c,
				name: 'Explora'
			}, {
				id: 0x8041,
				name: 'Yun'
			}, {
				id: 0x804d,
				name: 'Zero Pro'
			},
		],
	},
];

export const deviceFilters: DeviceFilter[] = [
	{
		name: 'Netgate',
		filters: [
			{ vid: 0x067b },
			{ vid: 0x10c4 },
		]
	},
	{
		name: 'Arduino',
		filters: [
			{ vid: 0x2341 },
			{ vid: 0x2a03 },
		]
	}
];

export function niceName(port: SerialPort): string | null
export function niceName(port: SerialPort, _default: string): string
export function niceName(port: SerialPort, _default?: string): string | null {
	const { usbVendorId, usbProductId } = port.getInfo();

	for (const vendor of vendors) {
		if (vendor.id === usbVendorId) {
			for (const device of vendor.devices || []) {
				if (device.id === usbProductId) {
					return `${vendor.alias || vendor.name} :: ${device.name}`
				}
			}

			return vendor.alias || vendor.name;
		}
	}

	return _default || null;
}
