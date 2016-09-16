<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class RoleController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController //
{
    public $modelClass = 'rest\models\RoleModel';
    public $Auth;
    protected $authname_extra = [
        'tagihaninfoinput_list',
        'tagihanpembayaran_listbayar'
    ];
    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['delete']);
        return $actions;
    }
    
    public function init(){
    	parent::init();
    }

    public function actionAssign(){
        $Auth = new $this->modelClass;
        $request = Yii::$app->getRequest();
        $rolename = $request->getQueryParam('rolename', false);
        $userid = $request->getQueryParam('userid', false);

        if($rolename && $userid){
            $role = $Auth->getRole($rolename);
            if(!$role){
                $role = $Auth->createRole('admin');
                $role->description = $form['description'];
                $Auth->add($role);
                $Auth->assign($role, $user->getId());
            }
            $Auth->assign($role, $userid);
            $this->response->setStatusCode(201, 'Created.');
            return $role;
        }else{
            $this->response->setStatusCode(422, 'Data Validation Failed.');
            return ['message' => 'Assign role failed'];
        }
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $Auth = new $this->modelClass;
        $request = Yii::$app->getRequest();
        $rolename = $request->getQueryParam('rolename', '');

        return $Auth->getRoles($rolename);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionListpermissions(){
        $Auth = new $this->modelClass;
        $request = Yii::$app->getRequest();
        $rolename = $request->getQueryParam('rolename', false);

        // if($rolename){
            $permission =  $Auth->getPermissionsByRole($rolename);
        // }else{
            // $permission =  $Auth->getPermissions();
        // }
        // var_dump($permission);exit();
        $list = [];
        foreach ($this->_listPermissions() as $key => $value) {
            $list[$key] = $value;
            if(in_array($value['name'], $this->authname_extra)){
                // $this->validAddChild($role, $rows['name'], $rows['description']);
                $list[$key]['read'] = isset($permission[$value['name']]) ? true : false;
            }else{
                $list[$key]['read'] = isset($permission[$value['name'] . '_view']) ? true : false;
                $list[$key]['create'] = isset($permission[$value['name'] . '_create']) ? true : false;
                $list[$key]['update'] = isset($permission[$value['name'] . '_update']) ? true : false;
                $list[$key]['delete'] = isset($permission[$value['name'] . '_delete']) ? true : false;
            }
            

        }
        return $list;
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionMenuprivileges(){
        $Auth = new $this->modelClass;
        $request = Yii::$app->getRequest();
        $userid = Yii::$app->user->getId();
        $list = [];
        $this->response = Yii::$app->getResponse();
        
        $this->authname_extra[] = 'kwitansipembayaran_create';
        $this->authname_extra[] = 'kwitansipengeluaran_create';
        if($userid){
            $permission =  $Auth->getPermissionsByUser($userid);
            foreach ($permission as $key => $value) {
                if(in_array($key, $this->authname_extra)){
                    $list[] = $key;
                }else{
                    if(preg_match('/_index/', $key)){
                        $list[] = str_replace('_index', '', $key);
                    }
                }
            }

            $checklist = implode(',', $list);
            if(preg_match('/(kelas|siswa|pegawai)/', $checklist)){
                $list[] = 'master';
            }

            if(preg_match('/(tagihaninfoinput|kwitansipembayaran|tagihanpembayaran|kwitansipengeluaran|tagihanautodebet)/', $checklist)){
                $list[] = 'keuangan';
            }

            if(preg_match('/(mcoad|postingmap|jurnalharian|rgl)/', $checklist)){
                $list[] = 'akuntansi';
            }

            if(preg_match('/(user|role|setting)/', $checklist)){
                $list[] = 'pengaturan';
            }
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }

        return $list;
    }

    public function actionInit(){
        // $Auth = new $this->modelClass;
        $permissions = $this->_listPermissions();

        foreach($permissions as $pms){
            $this->validAdd($pms['name'] . '_index', $pms['description'] );
            $this->validAdd($pms['name'] . '_view', $pms['description'] . ' View');
            $this->validAdd($pms['name'] . '_create', $pms['description'] . ' Create');
            $this->validAdd($pms['name'] . '_update', $pms['description'] . ' Update');
            $this->validAdd($pms['name'] . '_delete', $pms['description'] . ' Delete');
        }
    }

    private function _listPermissions(){
        $setPermissions = [
            ['parent_name' => 'MASTER DATA','name' => 'siswa', 'description' => 'Data Siswa', 'leaf' => true, 'parent' => 0, 'order' => 1],
            ['parent_name' => 'MASTER DATA','name' => 'pegawai', 'description' => 'Data Karyawan', 'leaf' => true, 'parent' => 0, 'order' => 2],
            ['parent_name' => 'MASTER DATA','name' => 'kelas', 'description' => 'Data Kelas', 'leaf' => true, 'parent' => 0, 'order' => 3],

            ['parent_name' => 'KEUANGAN','name' => 'tagihaninfoinput', 'description' => 'Info Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 1],
            ['parent_name' => 'KEUANGAN','name' => 'kwitansipembayaran', 'description' => 'Kwitansi Pembayaran', 'leaf' => true, 'parent' => 1, 'order' => 2],
            ['parent_name' => 'KEUANGAN','name' => 'tagihanpembayaran_listbayar', 'description' => 'Rekap Pembayaran Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 3],
            ['parent_name' => 'KEUANGAN','name' => 'tagihaninfoinput_list', 'description' => 'Rekap Outstanding Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 4],
            ['parent_name' => 'KEUANGAN','name' => 'kwitansipengeluaran', 'description' => 'Kwitansi Pengeluaran', 'leaf' => true, 'parent' => 1, 'order' => 3],
            // ['parent_name' => 'KEUANGAN','name' => 'kwitansipengeluaran', 'description' => 'Rekap Pengeluaran', 'leaf' => true, 'parent' => 1, 'order' => 4],
            ['parent_name' => 'KEUANGAN','name' => 'tagihanautodebet', 'description' => 'Reonsiliasi Autodebet', 'leaf' => true, 'parent' => 1, 'order' => 3],

            ['parent_name' => 'AKUNTANSI','name' => 'mcoad', 'description' => 'Master Akun', 'leaf' => true, 'parent' => 1, 'order' => 1],
            // ['parent_name' => 'AKUNTANSI','name' => 'postingmap', 'description' => 'Pemetaan Posting', 'leaf' => true, 'parent' => 1, 'order' => 2],
            ['parent_name' => 'AKUNTANSI','name' => 'jurnalharian', 'description' => 'Jurnal Harian', 'leaf' => true, 'parent' => 1, 'order' => 3],
            ['parent_name' => 'AKUNTANSI','name' => 'rgl', 'description' => 'Buku Besar', 'leaf' => true, 'parent' => 1, 'order' => 4],
            ['parent_name' => 'AKUNTANSI','name' => 'cashflow', 'description' => 'Rekap Arus Kas', 'leaf' => true, 'parent' => 1, 'order' => 4],

            ['parent_name' => 'PENGATURAN','name' => 'user', 'description' => 'Pengguna', 'leaf' => true, 'parent' => 1, 'order' => 1],
            ['parent_name' => 'PENGATURAN','name' => 'role', 'description' => 'Grup Akses Pengguna', 'leaf' => true, 'parent' => 1, 'order' => 2],
            ['parent_name' => 'PENGATURAN','name' => 'sekolah', 'description' => 'Sekolah', 'leaf' => true, 'parent' => 1, 'order' => 3],
        ];

        return  $setPermissions;
    }

    private function validAddChild($role, $name, $desc){
        $Auth = new $this->modelClass;

        $p = $Auth->getPermission($name);
        if(!$p){
            $p = $Auth->createPermission($name);
            $p->description = $desc;
            $Auth->add($p);
        }
        if(!$Auth->hasChild($role, $p)){
            $Auth->addChild($role, $p);
        }

        return $p;
    }

    private function validRemoveChild($role, $name){
        $Auth = new $this->modelClass;
        $p = $Auth->getPermission($name);
        if($p){
           if($Auth->hasChild($role, $p)){
                $Auth->removeChild($role, $p);
            }
        }
        return $p;
    }

    public function actionCreate(){
        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){
            extract($post);
            $Auth = new $this->modelClass;

            // Add / Update Role
            $role = $Auth->getRole($form['name']);
            if(!$role){
                $role = $Auth->createRole($form['name']);
                $role->description = $form['description'];
                $Auth->add($role);
                // $Auth->assign($role, $user->getId());
            }else{
                $role->description = $form['description'];
                $Auth->update($form['name'], $role);
            }

            $default_role = $Auth->getRole('default_role');
            if(!$Auth->hasChild($role, $default_role)){
                $Auth->addChild($role, $default_role);
            }

            // Add Permission to role
            foreach($grid as $rows){
                if(isset($rows['read']) && $rows['read']){
                    if(in_array($rows['name'], $this->authname_extra)){
                        $this->validAddChild($role, $rows['name'], $rows['description']);
                    }else{
                        $this->validAddChild($role, $rows['name'] . '_index', $rows['description'] . ' Index');
                        $this->validAddChild($role, $rows['name'] . '_view', $rows['description'] . ' View');
                    }
                }else{
                    if(in_array($rows['name'], $this->authname_extra)){
                        $this->validRemoveChild($role, $rows['name']);
                    }else{
                        $this->validRemoveChild($role, $rows['name'] . '_index');
                        $this->validRemoveChild($role, $rows['name'] . '_view');
                    }
                }

                if(isset($rows['create']) && $rows['create']){
                    $this->validAddChild($role, $rows['name'] . '_create', $rows['description'] . ' Create');
                }else{
                    $this->validRemoveChild($role, $rows['name'] . '_create');
                }

                if(isset($rows['update']) && $rows['update']){
                    $this->validAddChild($role, $rows['name'] . '_update', $rows['description'] . ' Update');
                }else{
                    $this->validRemoveChild($role, $rows['name'] . '_update');
                }
                
                if(isset($rows['delete']) && $rows['delete']){
                    $this->validAddChild($role, $rows['name'] . '_delete', $rows['description'] . ' Delete');
                }else{
                    $this->validRemoveChild($role, $rows['name'] . '_delete');
                }
            }
        }
        return ['success' => true];
    }

    public function actionDelete($id){

        $Auth = new $this->modelClass;
        $request = Yii::$app->getRequest();
        $rolename = $request->getQueryParam('rolename', false);

        if(isset($rolename) && !empty($rolename)){
            $result = $Auth->deleteRule($rolename);
            if($result !== true){
                $this->response->setStatusCode(422, 'Data Validation Failed.');
            }
            return $result;
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Rolename can\'t be empty'
            ];
        }
    }

    private function validAdd($name, $desc){
        $Auth = new $this->modelClass;
        $p = $Auth->getPermission($name);
        if(!$p){
            $p = $Auth->createPermission($name);
            $p->description =$desc;
            $Auth->add($p);
        }else{
            $p->description =$desc;
            $Auth->update($name, $p);
        }
        return $p;
    }
}