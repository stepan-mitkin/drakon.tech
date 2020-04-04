
box.cfg {
	background = true,
	listen = 3301,
	pid_file = "/dewt/tarantool.pid",
	memtx_dir = "/dewt/data",
	wal_dir = "/dewt/data",
	vinyl_dir = "/dewt/data",
	work_dir = "/dewt/app",
	log = "/dewt/logs/log.txt",
	memtx_memory = 512 * 1024 *1024,
	checkpoint_interval = 7200,
	custom_proc_title = "drakonhub_onprem"
}


my_ip = "213.162.241.171"
-- for localhost installation
-- my_ip = "127.0.0.1"

-- production setup, tarantool is behind nginx (or apache)
--host_for_http_server = "127.0.0.1"
--my_site = "example.com"
--insecure_cookie = false

-- debug setup
host_for_http_server = my_ip
my_site = my_ip
insecure_cookie = true

global_cfg = {
	--db = "tardb",
	db = "mysqldb",
	mysql = {
		host = "127.0.0.1",
		db = "drakonhub",
		user = "tara",
		password = "123456",	
		size = 5
	},
	diatest = "/dewt/diatest",
	host = host_for_http_server,
	port = 8090,
	http_options = {
		log_requests = false
	},	
	session_timeout = 10 * 24 * 3600,
	static_timeout = 1 * 3600,
	file_timeout = 2,
	static_dir = "/dewt/static",
	emails_dir = "/dewt/emails",
	feedback_dir = "/dewt/feedback",
	journal_dir = "/dewt/journal",
	content_dir = "/dewt/content",
	read_dir = "/dewt/read",	
	password_timeout = 5,
	use_capture = false,
	max_recent = 20,
	max_log = 50000,
	tmp = "/dewt/tmp",
	debug_mail = true,
	feedback_email = "bad@example.com",
	create_license = "extended",
	licensing = true,
	https_sender_port = 3400,
	google_anal = false,
	my_site = "https://" .. my_site,
	my_domain = my_site,
	my_ip = my_ip,
	complete_delay = 2,
	on_premises = true,
	application = "Logic View",
	insecure_cookie = insecure_cookie
}

external_creds = require("external_creds")
require("init")


