import { HttpRequest } from '../utils/httpRequest';

export default (method, url, file) => {
    browser.pause(3000);
    const result = HttpRequest.compareAjaxRequests(method, url, file);
}