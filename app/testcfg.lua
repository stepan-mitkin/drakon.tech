
box.cfg {
	background = true,
	listen = 3302,
	pid_file = "/dkt/testdata/tarantool.pid",
	memtx_dir = "/dkt/testdata",
	wal_dir = "/dkt/testdata",
	vinyl_dir = "/dkt/testdata",
	work_dir = "/home/stipan/dkt/app",
	log = "/dkt/testdata/log2.txt",
--	memtx_memory = 0.5,
	checkpoint_interval = 600,
}

global_cfg = {
	db = "tardb",
	--db = "mysqldb",
	-- Don't forget local use_mysql = true in api_test.cfg
	mysql = {
		host = "127.0.0.1",
		db = "testdb",
		user = "tara",
		password = "123456",	
		size = 5
	},
	host = "localhost",
	port = 8090,
	session_timeout = 4 * 60,
	static_timeout = 24 * 3600,
	file_timeout = 2,
	static_dir = "/home/stipan/dkt/static",
	emails_dir = "/home/stipan/dkt/emails",
	feedback_dir = "/dkt/testdata",
	journal_dir = "/dkt/testdata",
	content_dir = "/dkt/content",
	read_dir = "/dkt/read",	
	password_timeout = 1,
	use_capture = false,
	max_recent = 3,
	max_log = 500000,
	tmp = "/dkt/testdata",
	debug_mail = true,
	feedback_email = "drakon.editor@gmail.com",
	create_license = "basic",
	google_anal = false,
	my_site = "https://drakon.tech",
	my_domain = "drakon.tech",
	my_ip = "127.0.0.1",
	application = "Drakon Tech"
}

external_creds = require("external_creds")
require("init")


