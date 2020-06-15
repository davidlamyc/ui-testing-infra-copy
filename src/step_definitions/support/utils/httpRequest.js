import fs from 'fs';
import path from 'path';
import diff from 'deep-diff'

export class HttpRequest {
    static captureAjaxRequests() {
        browser.setupInterceptor();
    }

    static compareAjaxRequests(expectedMethod, expectedUrl, file) {
        browser.getRequests()
            .filter(request => {
                if (request.method === expectedMethod && request.url === expectedUrl) {
                    const expectedBody = fs.readFileSync(path.resolve(process.cwd(), browser.config.relativeHttpRequestsFolderPath, `${file}.json`), 'utf8');
                    const diffResult = diff(request.body, JSON.parse(expectedBody));
                    if (diffResult) {
                        throw new Error(JSON.stringify(diffResult, null, 2));
                    }
                }
                return request.method === expectedMethod && request.url === expectedUrl;
        });
    }
}