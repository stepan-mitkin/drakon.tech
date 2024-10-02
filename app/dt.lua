
box.cfg {
	background = true,
	listen = 3301,
	pid_file = "/dkt/tarantool.pid",
	memtx_dir = "/dkt/data",
	wal_dir = "/dkt/data",
	vinyl_dir = "/dkt/data",
	work_dir = "/dkt/app",
	log = "/dkt/logs/log.txt",
	memtx_memory = 512 * 1024 *1024,
	checkpoint_interval = 7200,
	custom_proc_title = "drakontech"
}

global_cfg = {
	db = "tardb",
	yandex_metrika = false,
	http_options = {
		log_requests = false
	},	
	carrot = false,
	host = "127.0.0.1",
	port = 8090,
	session_timeout = 30 * 24 * 3600,
	static_timeout = 1 * 3600,
	file_timeout = 30,
	static_dir = "/dkt/static",
	emails_dir = "/dkt/emails",
	feedback_dir = "/dkt/feedback",
	journal_dir = "/dkt/journal",
	gen_dir = "/dkt/gen",
	content_dir = "/dkt/content",
	read_dir = "/dkt/read",
	password_timeout = 5,
	use_capture = false,
	max_recent = 40,
	max_log = 500000,
	tmp = "/dkt/tmp",
	debug_mail = false,
	mg = true,
	feedback_email = "drakon.editor@gmail.com",
	create_license = "basic",
	licensing = true,
	https_sender_port = 3400,
	paypal_details = "/dkt/paypal",
	
	paypal_address = "https://api.paypal.com",	
	google_anal = true,
	my_site = "https://app.drakon.tech",
	my_domain = "app.drakon.tech",
	my_ip = "213.162.241.171",
	complete_delay = 0,
	on_premises = false,
	capterra = false,
	application = "Drakon.Tech",
	dead = true,
	gen_port = 7650
}

external_creds = require("external_creds")
require("init")

