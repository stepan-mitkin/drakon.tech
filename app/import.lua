-- Autogenerated with DRAKON Editor 1.32
local table = table
local string = string
local pairs = pairs
local ipairs = ipairs
local type = type
local box = box
local tostring = tostring

local global_cfg = global_cfg

local clock = require("clock")
local log = require("log")
local digest = require("digest")
local fiber = require("fiber")
local fio = require("fio")
local json = require("json")

local utils = require("utils")


local users = box.space.users

local spaces = box.space.spaces
local folders = box.space.folders
local items = box.space.items
local usettings = box.space.usettings
local recent = box.space.recent
local creds = box.space.creds

local db = require(global_cfg.db)

local skip = {
	id = true,
	group = true
}

setfenv(1, {}) 

function fix_zombies()
    -- item 242
    local trash = db.trash_get_all()
    for _, row in ipairs(trash) do
        -- item 245
        local space_id = row[1]
        local folder_id = row[2]
        -- item 246
        db.folder_tree_delete(
        	space_id,
        	folder_id
        )
    end
end

function get_fdata(space_id, folder_id)
    -- item 134
    local tuple = folders:get{space_id, folder_id}
    -- item 135
    return tuple[3]
end

function grant(space_id, users, access)
    -- item 202
    if users then
        for _, user_id in ipairs(users) do
            -- item 207
            db.rights_insert(
            	space_id,
            	user_id,
            	access,
            	{}
            )
        end
    end
end

function import_folder_data(folder_id, content)
    -- item 116
    local parent = content.parent
    -- item 112
    if type(parent) == "table" then
        -- item 118
        if folder_id == "1" then
            -- item 121
            parent = nil
        else
            -- item 115
            parent = "1"
        end
    end
    -- item 72
    local type = content.type
    -- item 73
    if type == "diagram" then
        -- item 76
        type = "drakon"
    end
    -- item 71
    local data = {
    	name = content.name,
    	type = type,
    	parent = parent,
    	children = {},
    	tag = content.tag,
    	deleted = content.is_deleted
    }
    -- item 77
    return data
end

function import_item_data(content)
    -- item 98
    local data = {}
    for key, value in pairs(content) do
        -- item 101
        if skip[key] then
            
        else
            -- item 104
            if key == "text" then
                -- item 107
                if content.content then
                    
                else
                    -- item 111
                    data.content = { txt = value }
                end
            else
                -- item 110
                data[key] = value
            end
        end
    end
    -- item 89
    return data
end

function import_user_data(content, user_id)
    -- item 154
    local email = content.email
    -- item 155
    if ((email) and (type(email) == "string")) and (not (email == "")) then
        
    else
        -- item 159
        email = "no_email-" .. user_id
    end
    -- item 153
    local data = {
    	name = content.name,
    	enabled = content.is_active,
    	admin = content.is_admin,
    	spaces = {}
    }
    -- item 162
    data.spaces[user_id] = true
    -- item 163
    return data, email
end

function move_rights()
    -- item 222
    local skip = true
    -- item 177
    local users = db.user_get_all()
    local spaces = db.space_get_all()
    for _, space in ipairs(spaces) do
        -- item 178
        local space_id = space[1]
        local sdata = space[2]
        -- item 183
        grant(space_id, sdata.admins, "admin")
        -- item 184
        grant(space_id, sdata.readers, "read")
        -- item 185
        grant(space_id, sdata.writers, "write")
    end
    for _, user in ipairs(users) do
        -- item 193
        local user_id = user[1]
        local email = user[2]
        local data = user[3]
        data.spaces = nil
        -- item 194
        db.user_update(
        	user_id,
        	email,
        	data
        )
    end
    for _, space in ipairs(spaces) do
        -- item 192
        local space_id = space[1]
        local sdata = space[2]
        -- item 196
        sdata.readers = nil
        sdata.writers = nil
        sdata.admins = nil
        -- item 195
        db.space_update(
        	space_id,
        	sdata
        )
    end
    for _, space in ipairs(spaces) do
        -- item 211
        local space_id = space[1]
        local sdata = db.space_get(space_id)
        -- item 214
        if sdata.trash then
            for folder_id, dummy in pairs(sdata.trash) do
                -- item 217
                db.trash_insert(
                	space_id,
                	folder_id
                )
            end
            -- item 220
            sdata.trash = nil
            -- item 221
            db.space_update(
            	space_id,
            	sdata
            )
        end
    end
    -- item 226
    local folders = db.folder_get_all()
    for _, row in ipairs(folders) do
        -- item 229
        local space_id = row[1]
        local folder_id = row[2]
        local fdata = row[3]
        -- item 231
        if fdata.parent then
            -- item 230
            db.folder_tree_upsert(
            	space_id,
            	folder_id,
            	fdata.parent
            )
        end
    end
    for _, row in ipairs(folders) do
        -- item 236
        local space_id = row[1]
        local folder_id = row[2]
        local fdata = row[3]
        -- item 237
        fdata.parent = nil
        fdata.children = nil
        -- item 238
        db.folder_update(
        	space_id,
        	folder_id,
        	fdata
        )
    end
end

function read_json_file(path)
    -- item 23
    local content = utils.read_all_bytes(path)
    -- item 24
    return json.decode(content)
end

function run_import()
    -- item 13
    local root = global_cfg.import
    -- item 16
    local user_files = fio.glob(root .. "/users/*")
    -- item 27
    log.info("%d users", #user_files)
    for _, user_file in ipairs(user_files) do
        -- item 30
        local user_id = fio.basename(user_file)
        -- item 142
        log.info("user %s", user_id)
        -- item 17
        local content = read_json_file(user_file)
        -- item 28
        local data, email = import_user_data(content, user_id)
        -- item 26
        users:insert{user_id, email, data}
    end
    -- item 34
    local cred_files = fio.glob(root .. "/creds/*")
    -- item 35
    log.info("%d creds", #cred_files)
    for _, cred_file in ipairs(cred_files) do
        -- item 38
        local user_id = fio.basename(cred_file)
        -- item 143
        log.info("cred %s", user_id)
        -- item 40
        local content = read_json_file(cred_file)
        -- item 41
        local data = {
        	hash = digest.base64_decode(content.hash),
        	salt = digest.base64_decode(content.salt)
        }
        -- item 42
        creds:insert{user_id, data}
    end
    -- item 49
    local space_files = fio.glob(root .. "/spaces/*")
    -- item 50
    log.info("%d spaces", #space_files)
    for _, space_file in ipairs(space_files) do
        -- item 53
        local space_id = fio.basename(space_file)
        -- item 144
        log.info("space %s", space_id)
        -- item 55
        local content = read_json_file(space_file)
        -- item 56
        local data = {
        	readers = content.readers,
        	writers = content.writers,
        	admins = content.admins,
        	next_id = content.next_id,
        	trash = utils.list_to_set(content.trash)
        }
        -- item 57
        spaces:insert{space_id, data}
    end
    -- item 58
    local folder_files = fio.glob(root .. "/folders/*")
    -- item 59
    log.info("%d folders", #folder_files)
    for _, folder_file in ipairs(folder_files) do
        -- item 62
        local basename = fio.basename(folder_file)
        local parts = utils.split(basename, "@")
        local space_id = parts[1]
        local folder_id = parts[2]
        -- item 145
        log.info("folder %s", basename)
        -- item 63
        local content = read_json_file(folder_file)
        -- item 65
        local data = import_folder_data(folder_id, content)
        -- item 64
        folders:insert{space_id, folder_id, data}
    end
    for _, folder_file in ipairs(folder_files) do
        -- item 127
        local basename = fio.basename(folder_file)
        local parts = utils.split(basename, "@")
        local space_id = parts[1]
        local folder_id = parts[2]
        -- item 146
        log.info("folder parents %s", basename)
        -- item 128
        local fdata = get_fdata(space_id, folder_id)
        -- item 136
        if (fdata.deleted) or (not (fdata.parent)) then
            
        else
            -- item 140
            local pdata = get_fdata(space_id, fdata.parent)
            pdata.children[folder_id] = true
            -- item 141
            utils.update3(
            	folders,
            	space_id,
            	fdata.parent,
            	pdata
            )
        end
    end
    -- item 90
    local item_files = fio.glob(root .. "/items/*")
    -- item 91
    log.info("%d items", #item_files)
    for _, item_file in ipairs(item_files) do
        -- item 94
        local basename = fio.basename(item_file)
        local parts = utils.split(basename, "@")
        local space_id = parts[1]
        local folder_id = parts[2]
        local item_id = parts[3]
        -- item 147
        log.info("item %s", basename)
        -- item 95
        local content = read_json_file(item_file)
        -- item 97
        local data = import_item_data(content)
        -- item 96
        items:insert{space_id, folder_id, item_id, data}
    end
    -- item 117
    log.info("import completed")
end


return {
	run_import = run_import,
	move_rights = move_rights,
	fix_zombies = fix_zombies
}
