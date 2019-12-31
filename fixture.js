const { RequestLogger, Selector } = require('testcafe')

const URL = 'https://en.wikipedia.org/wiki/Main_Page'
const SCRIPT = `
fetch("https://en.wikipedia.org/w/api.php?action=query&titles=Albert%20Einstein&prop=info&format=json")
    .then(res => res.text())
    .then(data => console.log('Data', data))
`

fixture('Reproducer')

test
.page(URL)
.clientScripts({content: SCRIPT, page: URL})
.before(async t => {
    await t.addRequestHooks(t.ctx.logger = RequestLogger(/Einstein/))
})
('Fail', async t => {
    await t.expect(Selector('div').withText('Welcome').visible).ok()
    const {log} = await t.getBrowserConsoleMessages()
    await t.expect(t.ctx.logger.requests.length).eql(1)
})

test
.clientScripts({content: SCRIPT, page: URL})
.before(async t => {
    await t.addRequestHooks(t.ctx.logger = RequestLogger(/Einstein/))
})
('Pass', async t => {
    await t.navigateTo(URL)
    await t.expect(Selector('div').withText('Welcome').visible).ok()
    const {log} = await t.getBrowserConsoleMessages()
    await t.expect(t.ctx.logger.requests.length).eql(1)
})
