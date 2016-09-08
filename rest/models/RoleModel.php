<?php
namespace rest\models;
use Yii;

class RoleModel extends \yii\rbac\DbManager
{
	/**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
    }

    public function getRoles($rolename = ''){
    	return (empty($rolename)) ? $this->getItems(1) : $this->getRole($rolename);
    }

    public function getPermissions(){
    	return $this->getItems(2);
    }

    public function setDefaultPermission($rolename = ''){
        return (empty($rolename)) ? $this->getItems(1) : $this->getRole($rolename);
    }

    /**
     * @inheritdoc
     */
    public function deleteRule($rolename)
    {   
        $role = $this->getItem($rolename);
        return $this->removeItem($role);
    }
}