/*eslint-env node */
/*eslint no-console: 0 */

function $(...data) {
  return new Map(data);
}

module.exports = {
    header: $(
        ['OFXHEADER', '100'],
        ['DATA', 'OFXSGML'],
        ['VERSION', '102'],
        ['SECURITY', 'NONE'],
        //['ENCODING', 'USASCII'],
        ['ENCODING', 'UTF-8'],
        //['CHARSET', '1252'],
        ['CHARSET', 'CSUNICODE'],
        ['COMPRESSION', 'NONE'],
        ['OLDFILEUID', 'NONE'],
        ['NEWFILEUID', 'NONE']
    ),
    //eslint-disable-next-line
    // ref: http://www.exactsoftware.com/docs/DocView.aspx?DocumentID=%7B6e02f9a5-ee40-4d2f-b8ea-4bee57825907%7D
    body: $(
        ['SIGNONMSGSRSV1', $(
            ['SONRS', $(
              ['STATUS', $(
                ['CODE', 0],
                ['SEVERITY', 'INFO']
              )],
              ['DTSERVER', 'YYYYMMDDhhmmss[+9:JST]'],
              ['LANGUAGE', 'JPN'],
              ['FI', $(
                ['ORG', 'Smoke Beacon Bank']
              )]
            )]
        )],
        ['BANKMSGSRSV1', $(
          ['STMTTRNRS', $(
            ['TRNUID', 0],
            ['STATUS', $(
              ['CODE', 0],
              ['SEVERITY', 'INFO']
            )],
            ['STMTRS', $(
              ['CURDEF', 'JPY'],
              ['BANKACCTFROM', $(
                ['BANKID', 9901],
                ['BRANCHID', '0101'],
                ['ACCTID', '04400091'],
                ['ACCTTYPE', 'SAVINGS']
              )],
              ['BANKTRANLIST', $(
                ['DTSTART', 'YYYYMMDDhhmmss[+9:JST]'],
                ['DTEND', 'YYYYMMDDhhmmss[+9:JST]']
              )]
            )],
            ['Dummy',0]
          )]
        )]
    ),
  };

/*
        BANKMSGSRSV1: {
            STMTTRNRS: {
                TRNUID: '0',
                STATUS: {
                    CODE: '0',
                    SEVERITY: 'INFO'
                },
                STMTRS: {
                    CURDEF: 'JPY',
                    BANKACCTFROM: {
                    //     BANKID: 'bank id',
                    //     BRANCHID: 'bank branch id',
                    //     ACCTID: 'account id',
                    //     ACCTTYPE: 'SAVINGS' // account type
                    },
                    BANKTRANLIST: {
                        DTSTART: null,
                        DTEND: null,
                        STMTTRN: []
                    },
                    LEDGERBAL: {
                        // BALAMT: '<amount>',
                        // DTASOF: 'YYYYMMDDhhmmss[+9:JST]'
                    }
                }
            }
        }

    }
};
*/
