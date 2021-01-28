const con = require('../connect')
const { SQLifyDate } = require('../utils/sql')
const { isEmpty, isNull } = require('lodash')

let BaseTable = class {
    constructor(table = '', fk = []) {
        this.table = table
        this.pk = 'ID'
        this.fk = fk
        this.fields = [
            { name: 'ID', type: 'INT', length: 11, default: 'AUTO_INCREMENT' },
            { name: 'date_created', type: 'TIMESTAMP', length: 255, default: SQLifyDate(new Date()) },
            { name: 'date_updated', type: 'TIMESTAMP', length: 255, default: SQLifyDate(new Date()) }
        ]
        this.qry = ''
        this.qryvars = []
        this.errors = []
    }

    getFieldNames() {
        return this.fields.map((f) => f.name)
    }

    validate(entry = {}) {
        // if entry passed in is not a JSON object with keys
        if (typeof entry !== 'object' || Object.keys(entry).length < 1) return false

        // if no fields exist in structure
        if (this.fields.length < 1) return false

        var errors = []

        var keys = Object.keys(entry)
        var field = null

        // loop through entry's keys to determine if the key supplied is in the table's structure
        keys.forEach(k => {
            field = this.fields.find(f => f.name == k)

            if (Object.keys(field).length < 0)
                errors.push(`Key ${k} does not exist in table: ${this.table}`)
        })

        if (errors > 0) {
            console.log(`The current entry is not valid for table: ${this.table}. Please correct field key/value before continuing.`)
            errors.forEach(e => console.log(e))
            process.exit(1)
        }

        return errors < 1
    }

    /* CREATE */
    insert(entries = []) {
        this.qry = `INSERT INTO ${this.table}`

        var field_names = this.getFieldNames()

        if (field_names.length < 1)
            this.errors.push({ table: `No fields defined in table: ${this.table}` })

        if (entries.length < 1)
            this.errors.push({ entries: `No entries defined to insert into table: ${this.table}` })

        this.qry += ' ('
        for (let i = 0; i < field_names.length; i++) {
            this.qry += `\`${field_names[i]}\``

            if (i < field_names.length - 1)
                this.qry += ', '
        }
        this.qry += ') VALUES ?'

        var temp = []
        if (typeof entries === 'object' && typeof entries.length === 'undefined') entries = [entries]

        entries.forEach((e, i) => {
            temp = []

            // arrange the values in correct order
            field_names.forEach(f => {
                var rel_field = this.fields.find(e => e.name === f)

                temp.push(typeof e[f] !== 'undefined' ? e[f] : rel_field.default)
            })

            entries[i] = temp

            if (!this.validate(e)) {
                this.errors.push(`Entry [${i}] is not valid relative to the table: ${this.table}. Please check supplied fields.`)
                delete entries[i]
            }
        });

        // because it's a prepared statement, the values variable must be a nested array
        // because you can add multiple values
        this.qryvars = [entries]

        return this
    }

    /* READ */
    select(fields = []) {
        this.qry = `SELECT `

        var field_names = this.getFieldNames()

        if (fields === '*') this.qry += `* `

        if (fields.length > 0 && fields !== '*') field_names = fields

        if (fields !== '*') {
            field_names = field_names.filter((f, i) => (f != 'date_created' && f != 'date_updated'))

            field_names.forEach((f, i) => {
                this.qry += f.indexOf('(') < 0 ? `\`${this.table}\`.` : ''
                this.qry += `${f}`

                this.qry += (f !== field_names[field_names.length - 1]) ? `, ` : `` // if not last, else
            })
        }

        this.qry += ` FROM \`${this.table}\``

        return this
    }

    /* UPDATE */
    update(set = {}) {
        this.qry = `UPDATE ${this.table}`

        var setkeys = Object.keys(set)

        if (setkeys.length > 0) {
            this.qry += ` SET `

            for (let i = 0; i < setkeys.length; i++) {
                this.qry += `\`${setkeys[i]}\``

                this.qry += ` = ?`

                if (i < setkeys.length - 1)
                    this.qry += `, `
            }
        }

        this.qryvars = Object.values(set)

        return this
    }

    /* DELETE */
    remove(args = {}) {
        this.qry = `DELETE FROM ${this.table}`

        var keys = Object.keys(args)
        var values = Object.values(args)

        if (keys.length > 0) {
            this.qry += ` WHERE `

            for (let i = 0; i < keys.length; i++) {
                this.qry += keys[i]

                this.qry += typeof args[keys[i]] == 'object' ? ` IN (?) ` : ` = ? `

                if (i < keys.length - 1)
                    this.qry += `AND `
            }
        }

        this.qryvars = values

        return this
    }

    where(where = {}) {
        if (typeof where.length === 'undefined') { // if where is a JSON object
            var where_keys = Object.keys(where || {})
            var where_values = Object.values(where || {})

            if (where_keys.length > 0) {
                this.qry += ` WHERE `

                for (let i = 0; i < where_keys.length; i++) {
                    this.qry += `\`${this.table}\`.\`${where_keys[i]}\``

                    this.qry += typeof where[where_keys[i]] == 'object' ? ` IN (?) ` : ` = ? `

                    if (i < where_keys.length - 1)
                        this.qry += `AND `
                }
            }

            this.qryvars = where_values
        }

        return this
    }

    limit(limit = null) {
        this.qry += limit ? ` LIMIT ${limit}` : ''

        return this
    }

    offset(offset = null) {
        this.qry += offset ? ` OFFSET ${offset}` : ''

        return this
    }

    execute() {
        if (Object.keys(this.errors).length > 0) return new Promise((rs, rj) => rj(this.errors))

        return con.query(this.qry, this.qryvars)
    }
}

module.exports = BaseTable