<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;

class TagihanpembayaranController extends \yii\rest\ActiveController // \rest\modules\api\ActiveController //
{
    public $modelClass = 'rest\models\TagihanPembayaran';

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionListinput(){
        // $model = new $this->modelClass();
        // $request = Yii::$app->getRequest();
        // return $this->prepareDataProvider($model->getListInput([
        //     'kelasid' => $request->getQueryParam('kelasid', false),
        //     'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', false),
        //     'query' => $request->getQueryParam('query', false),
        //     'idrombel' => $request->getQueryParam('idrombel', false)
        // ]));
    }

    /**
     * Prepares the data provider that should return the requested collection of the models.
     * @return ActiveDataProvider
     */
    protected function prepareDataProvider($query)
    {
        $request = Yii::$app->getRequest();
        $perpage = $request->getQueryParam('per-page', 20);
        $pagination = [
            'pageSize' => $perpage
        ];

        return new ActiveDataProvider([
            'query' => $query,
            'pagination' => ($perpage > 0) ? $pagination : false
        ]);
    }
}