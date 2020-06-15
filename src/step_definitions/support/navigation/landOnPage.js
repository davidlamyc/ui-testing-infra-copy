import path from 'path';
import process from 'process';
import glob from 'glob';

export default (page) => {
    const relativePageFolderPath = path.join(browser.config.relativePageFolderPath, `/**/${page}.js`)
    const currentPage = require(glob.sync(relativePageFolderPath)[0]);
    browser.setPage(currentPage);
}