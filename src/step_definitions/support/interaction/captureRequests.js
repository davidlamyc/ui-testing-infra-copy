import { HttpRequest } from '../utils/httpRequest';

export default () => {
    HttpRequest.captureAjaxRequests();
}