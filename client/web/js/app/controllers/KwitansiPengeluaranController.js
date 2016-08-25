'use strict';

define(['app'], function (app) {
	var injectParams = [
			'$CONST_VAR',
			'helperService',
    		'$scope', 
    		'toastr',
    		// 'toastrConfig',
    		'$location', 
    		'$routeParams', 
    		'$http', 
    		'$log', 
    		'ngDialog',
    		'cfpLoadingBar',
    		'$timeout',
    		'uiGridConstants',
    		'kwitansiPengeluaranService',
    		'authService'
    	];

    var KwitansiPengeluaranController = function (
		$CONST_VAR,
		helperService,
		$scope, 
		toastr,
		// toastrConfig,
		$location, 
		$routeParams, 
		$http, 
		$log, 
		ngDialog,
		cfpLoadingBar,
		$timeout,
		uiGridConstants,	
		kwitansiPengeluaranService,
		authService
	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/kwitansi-pengeluaran/';
    	var $resourceApi = kwitansiPengeluaranService;
    	var date = new Date();

    	function errorHandle(error){
			var msg = error.data.name;
			toastr.warning(msg, 'Warning');
		}

    	var indexController = function(){
    		var gridOptions = {
	    		columnDefs : [
					{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
					{ name: 'no_kwitansi', displayName: 'No Kwitansi', width : '120',  enableCellEdit: false},
					{ name: 'tgl_kwitansi', displayName: 'Tgl Kwitansi', width : '120',  enableCellEdit: false},
					{ name: 'nama_penerima', displayName: 'Nama Pembayar', enableCellEdit: false},
					{ name: 'nik', displayName: 'NIK', visible: false, enableCellEdit: false},
					{ name: 'keterangan', displayName: 'Keterangan', enableCellEdit: false},
					{ name: 'sekolahid', displayName: 'SekolahId', visible: false, enableCellEdit: false},
					{ name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, enableCellEdit: false},
					{ name: 'created_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'updated_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'created_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'updated_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				]
	    	};

	    	var columnActionTpl = 	'<div class="col-action">' + 
		    								'<a href="" ng-click="grid.appScope.onPrintClick(row.entity)" >' + 
		    						  			'<span class="badge bg-orange"><i class="fa fa-print"></i></span>' + 
		    						  		'</a>&nbsp;' +
		    						  		'<a href="" ng-click="grid.appScope.onEditClick(row.entity)" >' + 
		    						  			'<span class="badge bg-blue"><i class="fa fa-edit"></i></span>' + 
		    						  		'</a>&nbsp;' +
		    						  		'<a href="" ng-click="grid.appScope.onDeleteClick(row.entity)" >' + 
		    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
		    						  		'</a>' +
		    						  	'</div>';
		    gridOptions.columnDefs.push({
				name :' ',
				enableFiltering : false,
				width : '100',
				enableSorting : false,
				enableCellEdit: false,
				cellTemplate : columnActionTpl
			});	

	    	$scope.grid = { 
	    		enableMinHeightCheck : true,
				minRowsToShow : 20,
				enableGridMenu: true,
				enableSelectAll: true,
				virtualizationThreshold: 20,
				enableFiltering: true,
				enableCellEditOnFocus: true,
				columnDefs : gridOptions.columnDefs,
				//Export
			    onRegisterApi: function(gridApi){
			      $scope.gridApi = gridApi;
			    }
			};

			function setGridCollapse(collapse){
				var box = $('#kwitansi-pengeluaran-grid');
				var bf = box.find(".box-body, .box-footer");
				
				if (collapse) {
					box.find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
					box.addClass('collapsed-box');
					bf.slideUp();
				} else {
					box.find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
					box.removeClass('collapsed-box');
					bf.slideDown();
				}
			}

			function setFormCollapse(collapse){
				var box = $('#kwitansi-pengeluaran-form');
				var bf = box.find(".box-body, .box-footer");
				if (collapse) {
					box.find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
					box.addClass('collapsed-box');
					bf.slideUp();
				} else {
					box.find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
					box.removeClass('collapsed-box');
					bf.slideDown();
				}
			}

			function get(paramdata){
				cfpLoadingBar.start();
				$resourceApi.get(paramdata.page, paramdata.perPage)
				.then(function (result) {
	                if(result.success){
						angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;
			            })
			            $scope.grid.data = result.rows;
			            // $scope.gridApi.grid.minRowsToShow = 5; //paramdata.perPage;
			            // $scope.gridApi.grid.gridHeight =500;
					}
					cfpLoadingBar.complete();
	            }, errorHandle);
			}

			function deleteData($no){
				cfpLoadingBar.start();
				$resourceApi.delete($no)
				.then(function (result) {
	                if(result.success){
	                	toastr.success('Data telah berhasil dihapus.', 'Success');
					}
					cfpLoadingBar.complete();
					get({
						page : 1,
						perPage : 20
					});
	            }, errorHandle);
			}

			function printElement(elem) {
				var domClone = elem.cloneNode(true);

				var $printSection = document.getElementById("printSection");

				if (!$printSection) {
					var $printSection = document.createElement("div");
					$printSection.id = "printSection";
					document.body.appendChild($printSection);
				}
				$printSection.innerHTML = "";

				$printSection.appendChild(domClone);
			}

			this.init = function(){
				get({
					page : 1,
					perPage : 20
				});
			}

			$scope.print = function(divName){
				printElement(document.getElementById(divName));
				window.print();
			}

			$scope.onAddClick = function(event){
				setFormCollapse(false);
				setGridCollapse(true);
				reset();
				refreshNo();
			}

			$scope.onShowClick = function(event){
				setFormCollapse(true);
				setGridCollapse(false);
				reset();
			}

			$scope.onEditClick = function(rowdata){
				$location.path( "/keuangan/kwitansi-pengeluaran/edit/" + rowdata.no_kwitansi);
			}

			$scope.onDeleteClick = function(rowdata){
				var del = confirm("Anda yakin akan menghapus data `" + rowdata.no_kwitansi + "`");
				if (del == true) {
				    deleteData(rowdata.no_kwitansi);
				} 
			}

			$scope.onPrintClick = function(rowdata){
				var date = new Date();
				cfpLoadingBar.start();
				$resourceApi.getDetail({
					no_kwitansi : rowdata.no_kwitansi
				})
				.then(function (result) {
		            if(result.success){
		            	$scope.rowHeader = rowdata;
		            	$scope.rowDetail = result.rows;
		            	$scope.rowPrintTotal = function(){
		            		var total = 0;
		            		for(var idx in $scope.rowDetail){
		            			total += parseInt( $scope.rowDetail[idx].jumlah );
		            		}
							return  total;
						}
						$scope.rowTerbilang = helperService.terbilang($scope.rowPrintTotal());
						$scope.monthPrint = date.getMonth();
						$scope.monthYear = date.getFullYear();

				        ngDialog.open({
				            template: $scope.viewdir + 'print.html',
				            className: 'ngdialog-theme-flat',
				            scope: $scope,
				            width: '100%',
				            height: '100%'
				        });
					}
					cfpLoadingBar.complete();
		        }, function(error){
		        	toastr.warning('Rincian Kwitansi tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
		        });
			}
    	}

    	var addEditController = function(){
    		$scope.month = helperService.month().options;
	    	$scope.form = {
				no_kwitansi : '',
				tgl_kwitansi : date,
				nama_penerima : '',
				keterangan : '',
				nik : '',
				sekolahid : authService.getSekolahProfile().sekolahid,
				tahun_ajaran_id : authService.getSekolahProfile().tahun_ajaran_id,
				created_by : '',
				updated_by : '',
				created_at : date,
				updated_at : date
			};

			$scope.gridDetailDirtyRows = [];
			var columnDetailActionTpl = 	'<div class="col-action">' + 
		    								'<a href="" ng-click="grid.appScope.onDeleteDetailClick(row.entity)" >' + 
		    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
		    						  		'</a>' +
		    						  	'</div>';
			$scope.gridDetail = { 
	    		enableMinHeightCheck : true,
				minRowsToShow : 5,
				enableGridMenu: false,
				// enableSelectAll: true,
				enableFiltering: false,
				enableCellEditOnFocus: true,
				showGridFooter: true,
	    		showColumnFooter: true,
				columnDefs : [
					{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
					{ name: 'id', displayName: 'Id', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'no_kwitansi', displayName: 'No Kwitansi', visible: false, width : '120',  enableCellEdit: false},
					{ name: 'kode', displayName: 'Kode', width : '120', visible: false, enableCellEdit: false},
					{ name: 'rincian', displayName: 'Rincian'},
					{ 
						name: 'jumlah', 
						displayName: 'Jumlah', 
						width : '150',
						type: 'number', 
						cellFilter: 'number: 0',
						aggregationType: uiGridConstants.aggregationTypes.sum,
						aggregationHideLabel: true,
						footerCellFilter : 'number: 0'
					},
					{ name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
					{ name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false},
					{ name: 'flag', displayName: '', visible: false, width : '100',  enableCellEdit: false}
				],
				// data : [
				// 	{
				// 		index : 1,
				// 		kode : '',
				// 		no_kwitansi : $scope.form.no_kwitansi,
				// 		rincian : '',
				// 		jumlah : 0,
				// 		flag : 1
				// 	}
				// ],
				//Export
			    onRegisterApi: function(gridApi){
					$scope.gridApi = gridApi;
					gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
						if(oldValue != newValue && (parseInt(newValue))){
							$scope.gridDetailDirtyRows[rowEntity.index] = rowEntity;
						}else if(colDef.name == 'rincian' && oldValue != newValue && rowEntity != null){
							$scope.gridDetailDirtyRows[rowEntity.index] = rowEntity;
						}
						$scope.$apply();
					});
			    }
			};

			$scope.gridDetail.columnDefs.push({
				name :' ',
				enableFiltering : false,
				enableSorting : false,
				enableCellEdit: false,
				width : '50',
				cellTemplate : columnDetailActionTpl
			});

			function addDataDetail(detail, idx){
				var index = (typeof idx != 'undefined') ? idx : $scope.gridDetail.data.length + 1;
				$scope.gridDetail.data.push({
					"index": index,
					"kode": (typeof detail != 'undefined') ? detail.kode : '',
					"no_kwitansi": $scope.form.no_kwitansi,
					"rincian": (typeof detail != 'undefined') ? detail.rincian : '',
					"jumlah": (typeof detail != 'undefined') ? detail.jumlah : 0,
					"flag": 1,
				});
			}

			function reset(){
				$scope.form.tgl_kwitansi = date;
				$scope.form.nama_penerima = '';
				$scope.form.nik = '';
				$scope.form.keterangan = '';
				$scope.form.sekolahid = authService.getSekolahProfile().sekolahid;
				$scope.form.tahun_ajaran_id = authService.getSekolahProfile().tahun_ajaran_id;
				$scope.form.created_by = '';
				$scope.form.updated_by = '';
				$scope.form.created_at = date;
				$scope.form.updated_at = date;

				$scope.gridDetail.data = [
					{
						index : 1,
						kode : '',
						no_kwitansi : $scope.form.no_kwitansi,
						rincian : '',
						jumlah : 0,
						flag : 1
					}
				]
			}

			function refreshNo(){
				$resourceApi.getNewNoKwitansi({
					sekolahid : authService.getSekolahProfile().sekolahid
				})
				.then(function (result) {
		            if(result.success){
			            $scope.form.no_kwitansi = result.rows;
			            addDataDetail();
					}
		        }, function(error){
		        	toastr.warning('No Kwitansi tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
		        });
			}


			

			function getRowDetailByNo(noKwitansi){
				cfpLoadingBar.start();
				$resourceApi.getDetail({
					no_kwitansi : noKwitansi
				})
				.then(function (result) {
		            if(result.success){
		            	$scope.gridDetail.data = [];
		            	if(result.rows.length <= 0 )return false;
		            	
		            	angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;
			                result.rows[index]["jumlah"] = parseInt(result.rows[index]["jumlah"]);
			                result.rows[index]["flag"] = 1;
			            })
			            $scope.gridDetail.data = result.rows;
			            angular.forEach($scope.gridDetail.data, function(rowEntity, index) {
			                $scope.gridDetailDirtyRows.push(rowEntity);
			            })
					}
					cfpLoadingBar.complete();
		        }, function(error){
		        	toastr.warning('Rincian Kwitansi tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
		        });
			}

			function getById(id){
				cfpLoadingBar.start();
				$resourceApi.getById(id)
				.then(function (result) {
	                if(result.success){
						var rowdata = result.rows;
						$scope.form.no_kwitansi = rowdata.no_kwitansi;
						$scope.form.tgl_kwitansi = rowdata.tgl_kwitansi;
						$scope.form.nama_penerima = rowdata.nama_penerima;
						$scope.form.keterangan = rowdata.keterangan;
						$scope.form.nik = rowdata.nik;
						$scope.form.sekolahid = rowdata.sekolahid;
						$scope.form.tahun_ajaran_id = rowdata.tahun_ajaran_id;
						$scope.form.created_by = rowdata.created_by;
						$scope.form.updated_by = rowdata.updated_by;
						$scope.form.created_at = rowdata.created_at;
						$scope.form.updated_at = rowdata.updated_at;

						getRowDetailByNo(rowdata.no_kwitansi);
					}
					cfpLoadingBar.complete();
	            }, errorHandle);
			}

			this.init = function(){
				if($routeParams.id){
	                getById($routeParams.id);
	            }else{
	                refreshNo();
					// reset();
	            }
			}

			$scope.onSaveClick = function(event){
				if($scope.form.no_kwitansi == '' || $scope.form.no_kwitansi == null){
					toastr.warning('No Kwitansi tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.tgl_kwitansi == '' || $scope.form.tgl_kwitansi == null){
					toastr.warning('Tgl Kwitansi tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.nama_penerima == '' || $scope.form.nama_penerima == null){
					toastr.warning('Nama Penerima tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.gridDetailDirtyRows.length <= 0){
					toastr.warning('Rincian kwitansi belum diisi.', 'Warning');
					return false;
				}

				console.log($scope.gridDetailDirtyRows);
				// return; 
				var params = {
					form : $scope.form,
					grid : $scope.gridDetailDirtyRows
				}
				cfpLoadingBar.start();
				$resourceApi.insert(params)
				.then(function (result) {
	                if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						reset();
						refreshNo();
						cfpLoadingBar.complete();
						$location.path( "/keuangan/kwitansi-pengeluaran/");
						cfpLoadingBar.complete();
					}else{
						toastr.success('Data gagal tersimpan.<br/>' + result.message, 'Success');
						cfpLoadingBar.complete();
					}
	            }, errorHandle);
			}

			$scope.onResetClick = function(event){
				$location.path( "/keuangan/kwitansi-pengeluaran/");
			}

			$scope.onAddDetailClick = function(event){
				addDataDetail();
			}

			$scope.onDeleteDetailClick = function(rowdata){
				var idx = $scope.gridDetail.data.indexOf(rowdata),
					idxdirty = $scope.gridDetailDirtyRows.indexOf(rowdata);
				$scope.gridDetail.data.splice(idx,1);
				// $scope.gridDetailDirtyRows.splice(idxdirty,1);
				$scope.gridDetailDirtyRows[idxdirty].flag = 0;
			}
    	}

    	var controller;
		switch($location.$$url){
			case '/keuangan/kwitansi-pengeluaran/add' :
			console.log();
				controller = new addEditController();
				break;
			case '/keuangan/kwitansi-pengeluaran/edit/' + $routeParams.id :
				controller = new addEditController();
				break;
			default : 
				controller = new indexController();
				break;
		}

		$scope.$on('$viewContentLoaded', function(){
			// init();
		});

		$timeout(function() {
			controller.init();
		}, 1000);
    }
    KwitansiPengeluaranController.$inject = injectParams;

    app.register.controller('KwitansiPengeluaranController', KwitansiPengeluaranController);
});