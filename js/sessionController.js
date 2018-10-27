import FileLoadWidget from "./fileLoadWidget.js";
import FileLoadManager from "./fileLoadManager.js";
import {configureModal} from "./utils.js";

class SessionController {

    constructor ({ browser, $urlModal, $saveButton, $saveModal }) {

        let urlConfig =
            {
                dataTitle: 'Load Session',
                $widgetParent: $urlModal.find('.modal-body'),
                mode: 'url',
                dataOnly: true
            };
        
        this.urlWidget = new FileLoadWidget(urlConfig, new FileLoadManager({ sessionJSON: true }));

        configureModal(this.urlWidget, $urlModal, (fileLoadManager) => {
            browser.loadSession( fileLoadManager.dictionary.data );
            return true;
        });

        configureSaveModal(browser, $saveModal);

        $saveButton.on('click', (e) => {
            $saveModal.modal();
        });

    }


}

function configureSaveModal(browser, $modal){

    let $input = $modal.find('input');

    // upper dismiss - x - button
    let $dismiss = $modal.find('.modal-header button:nth-child(1)');
    $dismiss.on('click', function () {
        $input.val('');
        $modal.modal('hide');
    });

    // lower dismiss - close - button
    $dismiss = $modal.find('.modal-footer button:nth-child(1)');
    $dismiss.on('click', function () {
        $input.val('');
        $modal.modal('hide');
    });

    // ok - button
    let $ok = $modal.find('.modal-footer button:nth-child(2)');

    $ok.on('click', function () {

        let filename = $input.val();
        $input.val('');

        $modal.modal('hide');

        if (undefined === filename || '' === filename) {
            // do nothing
        } else {
            const json = browser.toJSON();
            const data = URL.createObjectURL(new Blob([ json ], { type: "application/octet-stream" }));
            igv.download(filename, data);
        }

    });

}

export default SessionController;