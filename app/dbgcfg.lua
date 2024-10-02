
box.cfg {
	background = false,
	listen = 3301,
	pid_file = "/dkt/tarantool.pid",
	memtx_dir = "/dkt/data",
	wal_dir = "/dkt/data",
	vinyl_dir = "/dkt/data",
	work_dir = "/home/stipan/drakon.tech/app",
	log = "/dkt/logs/log.txt",
	memtx_memory = 512 * 1024 * 1024,
	checkpoint_interval = 600,
	custom_proc_title = "dkt"
}

global_cfg = {
	skip_jobs = false,
	db = "tardb",
	--db = "mysqldb",
	mysql = {
		host = "127.0.0.1",
		db = "drakonhub",
		user = "tara",
		password = "123456",	
		size = 5
	},
	http_options = {
		log_requests = false
	},
	yandex_metrika = false,
	carrot = false,
	diatest = "/home/stipan/drakon.tech/diatest",
	host = "127.0.0.1",
	port = 8090,
	session_timeout = 3600 * 24 * 60,
	static_timeout = 1 * 3600,
	file_timeout = 2,
	static_dir = "/home/stipan/drakon.tech/static",
	emails_dir = "/home/stipan/drakon.tech/emails",
	content_dir = "/home/stipan/drakon.tech/content",
	feedback_dir = "/dkt/feedback",
	journal_dir = "/dkt/journal",
	gen_dir = "/dkt/gen",
	password_timeout = 5,
	use_capture = false,
	max_recent = 40,
	max_log = 50000,
	tmp = "/dkt/tmp",
	debug_mail = true,
	mg = false,
	feedback_email = "drakon.editor@gmail.com",
	create_license = "basic",
	licensing = true,
	https_sender_port = 3400,
	google_anal = false,
	my_site = "https://127.0.0.1",
	my_domain = "test.drakon.tech",
	my_ip = "62.122.254.187",
	complete_delay = 2,
	on_premises = true,
	capterra = false,
	application = "Drakon Tech",
	insecure_cookie = true,
	dead = true,
	gen_port = 7650
}

external_creds = require("external_creds")
require("init")


console = require("console")
print("starting console...")
console.start()

