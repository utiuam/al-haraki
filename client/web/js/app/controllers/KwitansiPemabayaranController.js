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
    		'kwitansiPemabayaranService',
    		'SiswaRombelService',
    		'TagihanInfoService',
    		'authService',
    		'KelasService',
    		'$filter'
    	];

    var KwitansiPemabayaranController = function (
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
		kwitansiPemabayaranService,
		SiswaRombelService,
		TagihanInfoService,
		authService,
		KelasService,
		$filter
	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/kwitansi-pembayaran/';
    	var $resourceApi = kwitansiPemabayaranService;
    	var date = helperService.dateTimeZone(); //new Date();

    	function errorHandle(error){
			var msg = error.data.name;
			toastr.warning(msg, 'Warning');
		}

    	var indexController = function(){
    		var gridOptions = {
	    		columnDefs : [
					{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
					{ name: 'idrombel', displayName: 'Id Rombel', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'sekolahid', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'no_kwitansi', displayName: 'No Kwitansi', width : '120',  enableCellEdit: false},
					{ name: 'tgl_kwitansi', displayName: 'Tgl Kwitansi', width : '120',  enableCellEdit: false},
					{ name: 'nama_pembayar', displayName: 'Nama Pembayar', visible: false, enableCellEdit: false},
					{ name: 'nama_siswa', displayName: 'Nama Siswa', visible: true, enableCellEdit: false},
					{ name: 'nis', displayName: 'NIS', visible: false, enableCellEdit: false},
					{ name: 'keterangan', displayName: 'Keterangan', enableCellEdit: false},
					{ 
	                    name: 'total', 
	                    displayName: 'Total', 
	                    width : '100', 
	                    type: 'number', 
	                    cellFilter: 'number: 0',
	                    aggregationType: uiGridConstants.aggregationTypes.sum, 
	                    aggregationHideLabel: true,
	                    headerCellClass : 'grid-align-right',
	                    cellClass: 'grid-align-right',
	                    footerCellClass : 'grid-align-right',
	                    footerCellFilter : 'number: 0'
	                },
					{ name: 'bulan', displayName: 'Bulan', visible: false, enableCellEdit: false},
					{ name: 'tahun', displayName: 'Tahun', visible: false, enableCellEdit: false},
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
		    						  		'<a href="" ng-click="grid.appScope.onEditClick($event, row.entity)" >' + 
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
				cellClass: 'grid-align-right',
				cellTemplate : columnActionTpl
			});	

	    	$scope.grid = { 
	    		paginationPageSizes: [20, 30, 50, 100, 200],
	            paginationPageSize: $CONST_VAR.pageSize,
	            pageNumber : 1,
	            useExternalPagination : true,
	    		enableMinHeightCheck : true,
	    		minRowsToShow : $CONST_VAR.pageSize,
	            enableGridMenu: true,
	            enableSelectAll: true,
	            virtualizationThreshold: $CONST_VAR.pageSize,
	            enableFiltering: true,
				columnDefs : gridOptions.columnDefs,
				showColumnFooter: true,
				expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:{{(row.entity.subGridOptions.data.length * 30) + 50}}px"></div>',
    			expandableRowHeight: 150,

    			onRegisterApi: function(gridApi){
	                $scope.gridApi = gridApi;
					gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
						$scope.grid.pageNumber = newPage;
						$scope.grid.pageSize = pageSize;
						$scope.grid.virtualizationThreshold = pageSize; 

						get({
							page : newPage,
							'per-page' : $scope.grid.virtualizationThreshold,
							date_start : $scope.filter.date_start,
							date_end : $scope.filter.date_end
						});
					});
					gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {               
			            row.expandedRowHeight = (row.entity.subGridOptions.data.length * 30) + 51;
			        });
			        $scope.gridApi.grid.registerDataChangeCallback(function(e) {
	                    setGridToContentXLS(gridApi);
	                });
	            }
			};

			$scope.filter = {
				date_start : helperService.date(date).firstDay,
				date_end : date //helperService.date(date).lastDay //
			}

			function setGridCollapse(collapse){
				var box = $('#kwitansi-pembayaran-grid');
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
				var box = $('#kwitansi-pembayaran-form');
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
				paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
				cfpLoadingBar.start();
				$resourceApi.get(paramdata)
				.then(function (result) {
	                if(result.success){
	                	var curpage = paramdata.page;
			            for(var idx in result.rows){
							var romnum = parseInt(idx) + 1,
								total = 0;
			                result.rows[idx]["index"] = romnum;
							result.rows[idx].subGridOptions = {
								// showGridFooter: true,
					   			// showColumnFooter: true,
					            minRowsToShow : 5,
								columnDefs: [ 
									{ name: 'index', displayName : 'No', width : '50', visible: true,enableFiltering : false ,  enableCellEdit: false},
									{ name: 'nik', displayName: 'NIK', visible: false, enableCellEdit: false},
									{ name: 'kode', displayName: 'Kode', visible: false, enableCellEdit: false},
									{ name: 'rincian', displayName: 'Rincian', visible: true, enableCellEdit: false},
									{ 
					                    name: 'jumlah', 
					                    displayName: 'Jumlah', 
					                    width : '100', 
					                    type: 'number', 
					                    cellFilter: 'number: 0',
					                    aggregationType: uiGridConstants.aggregationTypes.sum, 
					                    aggregationHideLabel: true,
					                    headerCellClass : 'grid-align-right',
					                    cellClass: 'grid-align-right',
					                    footerCellClass : 'grid-align-right',
					                    footerCellFilter : 'number: 0'
					                },
								],
								// data: result.rows[idx].details
							}
							for(var index in result.rows[idx].details){
								var subromnum = parseInt(index) + 1;
								result.rows[idx].details[index]["index"] = subromnum;
								total += parseInt(result.rows[idx].details[index].jumlah);
							}
							result.rows[idx].subGridOptions.data = result.rows[idx].details;
							result.rows[idx]["total"] = total;

							if(result.rows[idx].nama_pembayar == '' || result.rows[idx].nama_pembayar == null){
				            	result.rows[idx].nama_pembayar = result.rows[idx].nama_siswa;
				            }else if(result.rows[idx].nama_siswa == '' || result.rows[idx].nama_siswa == null){
				            	result.rows[idx].nama_siswa = result.rows[idx].nama_pembayar;
				            }
						}

			            $scope.grid.data = result.rows;
			            $scope.grid.totalItems = result.total;
						$scope.grid.paginationCurrentPage = curpage;
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
						'per-page' : $CONST_VAR.pageSize,
						date_start : $scope.filter.date_start,
						date_end : $scope.filter.date_end
					});
	            }, errorHandle);
			}

			this.init = function(){
				get({
					page : 1,
					'per-page' : $CONST_VAR.pageSize,
					date_start : $scope.filter.date_start,
					date_end : $scope.filter.date_end
				});
			}

			$scope.onAddClick = function(event){
				setFormCollapse(false);
				setGridCollapse(true);
				reset();
				refreshNo();
			}

			$scope.onSearchClick = function(event){
				if($scope.filter.date_start == '' || $scope.filter.date_start == null){
					toastr.warning('Tgl Awal tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.filter.date_end == '' || $scope.filter.date_end == null){
					toastr.warning('Tgl Akhir tidak boleh kosong.', 'Warning');
					return false;
				}
				get({
					page : 1,
					'per-page' : $scope.grid.virtualizationThreshold,
					date_start : $scope.filter.date_start,
					date_end : $scope.filter.date_end,
					sumber_kwitansi : $scope.filter.sumber_kwitansi
				});
			}
			
			$scope.onShowClick = function(event){
				setFormCollapse(true);
				setGridCollapse(false);
				reset();
			}

			$scope.onEditClick = function(event,rowdata){
				helperService.navigateTo(event, "/keuangan/kwitansi-pembayaran/edit/" + 
											rowdata.no_kwitansi, rowdata.no_kwitansi);
			}

			$scope.onDeleteClick = function(rowdata){
				var del = confirm("Anda yakin akan menghapus data `" + rowdata.no_kwitansi + "`");
				if (del == true) {
				    deleteData(rowdata.no_kwitansi);
				} 
			}

			$scope.onExport = function(type){
	            if($scope.grid.data.length <= 0){
	                toastr.warning('Rekap data masih kosong.', 'Warning');
	                return false;
	            }

	            exportTo[type]($scope.gridApi);  
	        }

	        var exportTo = {
	            xls : function(gridApi){
	                function download(id){
	                    var dt = helperService.dateTimeZone();
	                    var day = dt.getDate();
	                    var month = dt.getMonth() + 1;
	                    var year = dt.getFullYear();
	                    var hour = dt.getHours();
	                    var mins = dt.getMinutes();
	                    var postfix = year.toString() + month.toString() + day.toString() + '-' + hour.toString() + mins.toString();

	                    var uri = 'data:application/vnd.ms-excel;base64,'
	                    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
	                    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
	                    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }

	                    var table = document.getElementById(id);
	                    // console.log(table);
	                    var ctx = { worksheet : name || 'Rekap_Pembayaran ' + postfix, table : table.innerHTML }
	                    
	                    var a = document.createElement('a');
	                    a.href = uri + base64(format(template, ctx));
	                    a.download = 'rekap_pembayaran_' + postfix + '.xls';
	                    a.click();
	                    // return false;
	                }
	                return download('print-rekap');
	            },

	            _title : 'Rekap Pembayaran Kwitansi ' + authService.getSekolahProfile().nama_sekolah,
	            _titleDate : 'PER - ' + helperService.formatDateID(date),
	        }

	        $scope.templateExport = {
                title : exportTo._title,
                titleDate : exportTo._titleDate,
                table  : {},
            }

	        function setGridToContentXLS(gridApi){
	            // var rows = gridApi.grid.rows;
	            var rows = gridApi.core.getVisibleRows(gridApi.grid);
	            var rdate = 'PER - ' + helperService.formatDateID(date);

	            function formatValueNumber(val){
	                if((typeof val !='undefined' && parseInt(val))){
	                    return parseInt(val); //$filter('number')(val, 0);
	                }
	                return '';
	            }

	            function setTableData(obj){
	                var rowdata;
	                var rowbody = [];
	                var granttotal = 0;
	                // Set Body Table
	                for(var idx in obj){
	                    rowdata = obj[idx].entity;
	                    var no = parseInt(idx) + 1;
	                    rowbody.push({
                            index : no.toString(),
                            no_kwitansi : rowdata.no_kwitansi,
                            tgl_kwitansi : rowdata.tgl_kwitansi,
                            nama_siswa : rowdata.nama_siswa,
                            keterangan : rowdata.keterangan,
                            total : formatValueNumber(rowdata.total),
                        });
                        granttotal += formatValueNumber(rowdata.total);
	                }
	                $scope.templateExport.table =  {
	                    rows : rowbody,
	                    total : granttotal
	                };
	            }

	            $timeout(function () {
				    setTableData(rows);
				}, 300);
	        }
    	}

    	function printElement(elem) {
			var domClone = elem.cloneNode(true);

			var $printSection = document.getElementById("printSection");
			if ($printSection) {
				$printSection.innerHTML = "";
			}else{
				$printSection = document.createElement("div");
				$printSection.id = "printSection";
				document.body.appendChild($printSection);
			}
			
			// $printSection.appendChild(domClone);
			$printSection.innerHTML = domClone.innerHTML;
			window.print();
		}

		function printClick(rowdata){
			var date = helperService.dateTimeZone();
			cfpLoadingBar.start();
			$resourceApi.getDetail({
				no_kwitansi : rowdata.no_kwitansi
			})
			.then(function (result) {
	            if(result.success){
	            	if (typeof rowdata.nama_kelas == 'undefined' && typeof $scope.rombel_typehead != 'undefined') {
	            		var splitKelas = $scope.rombel_typehead.kelas.split(" - ");
	            		rowdata.kelas = splitKelas[0];
	            		rowdata.nama_kelas = splitKelas[1];
	            	}

	            	$scope.rowHeader = rowdata;
	            	$scope.rowHeader.keterangan = $scope.rowHeader.keterangan.replace(/(?:\r\n|\r|\n)/g, '<br />');
	            	$scope.rowDetail = result.rows;
	            	$scope.profil = authService.getProfile();
	            	$scope.sekolahProfil = authService.getSekolahProfile();
	            	$scope.rowPrintTotal = function(){
	            		var total = 0;
	            		for(var idx in $scope.rowDetail){
	            			total += parseInt( $scope.rowDetail[idx].jumlah );
	            		}
						return  total;
					}
					$scope.rowTerbilang = helperService.terbilang($scope.rowPrintTotal());
					$scope.tanggal  = date.getDate() + ' ' + 
                            helperService.getMonthName(date.getMonth()) + ' ' + 
                            date.getFullYear();
                    $scope.titleadmin = (authService.getSekolahProfile().sekolahid == 1) ? 'Admin SDIT' : 'Admin SMPIT';
                    var blnTagihan = $scope.rowHeader.month || $scope.rowHeader.bulan.split(',');
                    if(blnTagihan && blnTagihan.length == 1){
                    	$scope.bulanTagihan = helperService.getMonthName(parseInt(blnTagihan[0]) - 1);
                    }else if(blnTagihan && blnTagihan.length > 1){
                    	$scope.bulanTagihan = helperService.getMonthNameShort(parseInt(blnTagihan[0]) - 1) + ' s/d ' +
                     							helperService.getMonthNameShort(parseInt(blnTagihan[blnTagihan.length - 1]) - 1);
                    }else{	
                    	$scope.bulanTagihan = '';
                    }


			        ngDialog.open({
			            template: $scope.viewdir + 'print.html',
			            className: 'ngdialog-theme-flat dialog-custom1 dialog-gray custom-width-80',
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

		$scope.print = function(divName){
			printElement(document.getElementById(divName));
		}

		$scope.onPrintClick = function(rowdata){
			printClick(rowdata);
		}

    	var addEditController = function(){
    		// console.log(date)
    		$scope.month = helperService.month().options;
	    	$scope.form = {
				no_kwitansi : '',
				tgl_kwitansi : '',
				nama_pembayar : '',
				siswaid : '',
				kelasid : '',
				nama_siswa : '',
				sekolahid : authService.getSekolahProfile().sekolahid,
				tahun_ajaran_id : authService.getSelectedTahun().id,
				idrombel : '',
				keterangan : '',
				sumber_kwitansi : '',
				month : [],
				year : '',
				created_by : null,
				updated_by : null,
				created_at : null,
				updated_at : null
			};

			$scope.rombel;
			$scope.rombel_typehead = {
				data : [],
				nis : '',
				kelas : '',
				select : ''
			};

			$scope.ActionBtn = {
				cancel : true,
				save : true	
			}

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
				data : [
					{
						index : 1,
						kode : '',
						no_kwitansi : $scope.form.no_kwitansi,
						rincian : '',
						jumlah : 0,
						flag : 1
					}
				],
				//Export
			    onRegisterApi: function(gridApi){
					$scope.gridApi = gridApi;
					gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
						// if(oldValue != newValue && (parseInt(newValue))){
						// 	$scope.gridDetailDirtyRows.push(rowEntity);
						// }else if(colDef.name == 'rincian' && oldValue != newValue && rowEntity != null){
						// 	$scope.gridDetailDirtyRows.push(rowEntity);
						// }
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

			function reset(){
				$scope.form.tgl_kwitansi = date;//helperService.dateToString(date);
				$scope.dateTest = date.toLocaleString();
				$scope.form.nama_pembayar = '';
				$scope.form.idrombel = '';
				$scope.form.keterangan = '';
				$scope.form.sekolahid = authService.getSekolahProfile().sekolahid;
				$scope.form.tahun_ajaran_id = authService.getSelectedTahun().id;
				$scope.rombel_typehead.nis = '';
				$scope.rombel_typehead.kelas = '';
				$scope.rombel_typehead.select = '';
				$scope.form.sumber_kwitansi = '';
				$scope.form.month[0] = helperService.getMonthId(date.getMonth());
				$scope.form.year = date.getFullYear();

				$scope.gridDetail.data = [
					{
						index : 1,
						kode : '',
						no_kwitansi : $scope.form.no_kwitansi,
						rincian : '',
						jumlah : 0,
						flag : 1
					}
				];

				$scope.ActionBtn = {
					cancel : true,
					save : true	
				};
			}

			function refreshNo(paramdata){
				$resourceApi.getNewNoKwitansi({
					sekolahid : authService.getSekolahProfile().sekolahid
				})
				.then(function (result) {
		            if(result.success){
			            $scope.form.no_kwitansi = result.rows;
					}
		        }, function(error){

		        	toastr.warning('No Kwitansi tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
		        });
			}

			function getRombelBySiswa(namaSiswa, callback){

				var paramdata = {};
				paramdata['tahun_ajaran_id'] = $scope.form.tahun_ajaran_id;
				paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
				paramdata['nama_siswa'] = namaSiswa;
				paramdata['scenario'] = 2;

				cfpLoadingBar.start();
				return SiswaRombelService.getListBySiswa(paramdata)
				.then(function (result) {
		            if(result.success){
		            	$scope.rombel_typehead.data = result.rows;
		            	if(typeof callback == 'function' && result.rows.length > 0){
		            		callback(result.rows[0]);
		            	}else if(typeof callback == 'function'){
		            		callback("");
		            	}
			            return result.rows;
					}
					cfpLoadingBar.complete();
		        }, function(error){
		        	toastr.warning('Siswa tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
		        });
			}

			function addDataDetail(detail, idx){
				var index = (typeof idx != 'undefined') ? idx : $scope.gridDetail.data.length + 1;
				$scope.gridDetail.data.push({
					"index": index,
					"kode": (typeof detail != 'undefined') ? detail.kode : '',
					"no_kwitansi": $scope.form.no_kwitansi,
					"rincian": (typeof detail != 'undefined') ? detail.rincian : '',
					"jumlah": (typeof detail != 'undefined') ? detail.jumlah : 0,
					"flag": 1
				});
			}

			function getInfoTagihan(){
				if($scope.form.nama_siswa == '' || $scope.form.nama_siswa == null){
					toastr.warning('Nama siswa belum diisi.', 'Warning');
					return false;
				}
				cfpLoadingBar.start();
				var d = new Date($scope.form.tgl_kwitansi);
				TagihanInfoService.getList({
					idrombel : $scope.form.idrombel,
					month : d.getMonth() + 1,
					year : $scope.form.year
				})
				.then(function (result) {
		            if(result.success){
		            	$scope.gridDetail.data = [];
		            	var row = result.rows[0];
			            addDataDetail({
			            	kode : 'spp',
			            	rincian : 'SPP',
			            	jumlah : parseInt(row.spp),
			            });
			            addDataDetail({
			            	kode : 'komite_sekolah',
			            	rincian : 'Komite Sekolah',
			            	jumlah : parseInt(row.komite_sekolah)
			            });
			            addDataDetail({
			            	kode : 'catering',
			            	rincian : 'Catering',
			            	jumlah : parseInt(row.catering)
			            });
			            addDataDetail({
			            	kode : 'keb_siswa',
			            	rincian : 'Kebutuhan Siswa',
			            	jumlah : parseInt(row.keb_siswa)
			            });
			            addDataDetail({
			            	kode : 'ekskul',
			            	rincian : 'Ekskul',
			            	jumlah : parseInt(row.ekskul)
			            });
			            angular.forEach($scope.gridDetail.data, function(rowEntity, index) {
			                // $scope.gridDetailDirtyRows.push(rowEntity);
			                $scope.gridDetailDirtyRows[rowEntity.index] = rowEntity;
			            })
					}
					cfpLoadingBar.complete();
		        }, function(error){
		        	toastr.warning('Info Tagihan tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
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
			                $scope.gridDetailDirtyRows[romnum] = result.rows[index];
			            })
			            $scope.gridDetail.data = result.rows;
			            // angular.forEach($scope.gridDetail.data, function(rowEntity, index) {
			            //     $scope.gridDetailDirtyRows.push(rowEntity);
			            // })
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
						$scope.form.nama_pembayar = rowdata.nama_pembayar;
						
						$scope.form.idrombel = rowdata.idrombel;
						$scope.form.keterangan = rowdata.keterangan;
						$scope.form.sekolahid = rowdata.sekolahid;
						$scope.form.tahun_ajaran_id = rowdata.tahun_ajaran_id;
						$scope.form.tahun_ajaran_id_old = rowdata.tahun_ajaran_id;
						$scope.form.sumber_kwitansi = rowdata.sumber_kwitansi;
						$scope.form.month = rowdata.bulan.split(',');
						for(var idx in $scope.form.month){
							$scope.form.month[idx] = parseInt($scope.form.month[idx]);
						}
						$scope.form.year = rowdata.tahun;
						$scope.form.created_by = rowdata.created_by;
						$scope.form.created_at = rowdata.created_at;

						// getRombel({
						// 	sekolahid : authService.getSekolahProfile().sekolahid
						// });

						$scope.remoteSourceTypeHead($scope.form.nama_pembayar, function(siswa){
							$scope.form.nama_siswa = rowdata.nama_pembayar;
							$scope.rombel_typehead.select = $scope.form.nama_siswa;
			            	selectSiswa(siswa);
			            });
						
						getRowDetailByNo(rowdata.no_kwitansi);
					}
					cfpLoadingBar.complete();
	            }, errorHandle);
			}

			function getTahunAjaranSelected(tahunAjaranId){
	            var tahunList = authService.getTahunList();
	            for(var x in tahunList){
	                if(tahunList[x].id == tahunAjaranId){
	                    return tahunList[x];
	                }
	            }
	            return tahunList[0];
			}

			function getKelasSelected(kelasid){
	            var kelaslist = $scope.kelasList;
	            for(var x in kelaslist){
	                if(kelaslist[x].id == kelasid){
	                    return kelaslist[x];
	                }
	            }
	            return null;
			}

			function selectSiswa(siswa, loadInfo){
				if(typeof loadInfo == 'undefinde')loadInfo = false;
				$scope.rombel_typehead.nis = (siswa.nis == null) ? '' : siswa.nis;
				if(siswa.kelas != null){
					$scope.rombel_typehead.kelas = siswa.kelas + ' - ' + siswa.nama_kelas;
				}else{
					$scope.rombel_typehead.kelas = '';
				}
				
				$scope.form.idrombel = siswa.id;
				$scope.form.siswaid = siswa.siswaid;
				$scope.form.nama_siswa = (siswa.nama_siswa == null) ? '' : siswa.nama_siswa;
				if($scope.form.sumber_kwitansi == '1' && loadInfo){
					getInfoTagihan();
				}
			}

			function getkelas(params){
                KelasService.getList(params)
                .then(function (result) {
                    if(result.success){
                        $scope.kelasList = result.rows;
                    }   
                }, function(error){
                    toastr.warning('Kelas tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
                });
            }

			this.init = function(){
				$scope.tahunList = authService.getTahunList();
				getkelas({
                    page : 1,
                    "per-page" : 0,
                    sekolahid : authService.getSekolahProfile().sekolahid
                });
				if($routeParams.id){
					$scope.isEdit = true;
	                getById($routeParams.id);
	            }else{
	            	$scope.isEdit = false;
	                refreshNo();
					reset();
					// getRombel({
					// 	sekolahid : authService.getSekolahProfile().sekolahid
					// });
	            }
			}

			$scope.onChoseKelasClick = function(){
				var tahunList = getTahunAjaranSelected($scope.form.tahun_ajaran_id);
				$scope.tahun_ajaran = tahunList.tahun_ajaran;
                ngDialog.open({
                    template: $scope.viewdir + 'form_kelas.html',
                    className: 'ngdialog-theme-flat dialog-custom1 dialog-gray custom-width-50',
                    scope: $scope,
                    width: '100%',
                    height: '100%'
                });
                // $scope.formEdit.kelasid = rowdata.kelasid;
            }

            $scope.onCancelKelasClick = function(){
                $scope.form.kelasid = '';
                ngDialog.close();
            }

			/**
			 * 
			 * @param object event properties
		     * @param mixed value of select
		     * @param int index of selected value in dropdown
		     * @param object properties of calling element ($id to get the id)
		     */
			$scope.$on('$typeahead.select', function(event, value, index, elem){
		        if($scope.form.nama_siswa != value.nama_siswa){
		        	selectSiswa(value, true);
		        	$scope.$apply();
		        }
		        
			});
			
			$scope.remoteSourceTypeHead = function(value, callback){
				if(value && value.length >= 3){
					return getRombelBySiswa(value, callback);
				}
				return null;
			}

			$scope.onTahunidChange = function(value){
	            if($scope.form.nama_siswa != '' && $scope.form.nama_siswa != null){
	            	$scope.remoteSourceTypeHead($scope.form.nama_siswa, function(siswa){
		            	selectSiswa(siswa);
						$scope.form.year = date.getFullYear();
		            });
	            }
	        }

			$scope.onChangeDateTrans = function(sumber_kwitansi){
				var d = new Date($scope.form.tgl_kwitansi);
				var selectmonth = d.getMonth() + 1;

				$scope.gridDetailDirtyRows = [];

				if(sumber_kwitansi =='1'){
					// console.log(authService.getSekolahProfile().tahun_awal);
					var tahunList = getTahunAjaranSelected($scope.form.tahun_ajaran_id);
					$scope.form.year = (selectmonth >= 1 &&  selectmonth <= 6) ? 
										(tahunList.tahun_akhir) : tahunList.tahun_awal;
					getInfoTagihan();
				}else{
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

				if($scope.gridDetailDirtyRows.length <= 0){
					toastr.warning('Rincian kwitansi belum diisi.', 'Warning');
					return false;
				}
				
				var kelas_value_befor = $scope.rombel_typehead.kelas;
				if((typeof $scope.form.idrombel == 'undefined'
					|| $scope.form.idrombel == null 
					|| $scope.form.idrombel == '') && 
					(typeof $scope.form.kelasid == 'undefined'
					|| $scope.form.kelasid == null 
					|| $scope.form.kelasid == '')
				){
					if($scope.form.sumber_kwitansi == 1 || $scope.form.sumber_kwitansi == '1'){
						$scope.onChoseKelasClick();
						return;
					}
					
				}

				ngDialog.close();

				var kelasSelected = getKelasSelected($scope.form.kelasid);
				if(kelasSelected != null){
					$scope.rombel_typehead.kelas = kelasSelected.kelas + ' - ' + kelasSelected.nama_kelas;
				}else{
					$scope.rombel_typehead.kelas = kelas_value_befor;
				}

				// console.log($scope.gridDetailDirtyRows);return;
				if(typeof $scope.form.nama_siswa !='undefined' && $scope.form.nama_siswa!=''){
					$scope.form.nama_pembayar = $scope.form.nama_siswa;
				}else{
					$scope.form.nama_pembayar = $scope.rombel_typehead.select;
				}
				
				var params = {
					form : $scope.form,
					grid : $scope.gridDetailDirtyRows
				}

				// console.log(params);
				// return;
				params.form.tgl_kwitansi = helperService.dateToString(params.form.tgl_kwitansi);

				cfpLoadingBar.start();

				function success(result){
					if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						$scope.form.no_kwitansi = result.rows;
						$scope.ActionBtn = {
							cancel : false,
							save : false	
						}
						printClick($scope.form);
						// reset();
						// refreshNo();
						cfpLoadingBar.complete();
						// $location.path( "/keuangan/kwitansi-pembayaran/");
					}else{
						toastr.error('Data gagal tersimpan.' + result.message, 'Error');
						cfpLoadingBar.complete();
					}
				}

				if($routeParams.id){
					$resourceApi.update(params)
					.then(success, errorHandle);
				}else{
					$resourceApi.insert(params)
					.then(success, errorHandle);
				}
			}

			$scope.onResetClick = function(event){
				// setFormCollapse(true);
				// setGridCollapse(false);
				// reset();
				$location.path( "/keuangan/kwitansi-pembayaran/");
			}

			$scope.onAddDetailClick = function(event){
				addDataDetail();
			}

			$scope.onDeleteDetailClick = function(rowdata){
				var idx = $scope.gridDetail.data.indexOf(rowdata),
					idxdirty = $scope.gridDetailDirtyRows.indexOf(rowdata);
				$scope.gridDetail.data.splice(idx,1);
				// $scope.gridDetailDirtyRows.splice(idxdirty,1);
				if($scope.gridDetailDirtyRows.length > 0){
					$scope.gridDetailDirtyRows[idxdirty].flag = 0;
				}
			}

			$scope.onAddClick = function(){
				refreshNo();
				reset();
			}
    	}

    	var controller;
		switch($location.$$url){
			case '/keuangan/kwitansi-pembayaran/add' :
				controller = new addEditController();
				break;
			case '/keuangan/kwitansi-pembayaran/edit/' + $routeParams.id :
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
    KwitansiPemabayaranController.$inject = injectParams;

    app.register.controller('KwitansiPemabayaranController', KwitansiPemabayaranController);
});
