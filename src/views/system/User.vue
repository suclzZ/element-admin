<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.loginName" placeholder="登录名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="35"></el-table-column>
				<el-table-column type="index" width="40"></el-table-column>
				<el-table-column prop="loginName" label="登录名"  sortable></el-table-column>
				<el-table-column prop="userCaption" label="姓名"  sortable></el-table-column>
				<el-table-column prop="birthday" label="生日"  sortable></el-table-column>
				<el-table-column prop="telephone" label="电话"  sortable></el-table-column>
				<el-table-column prop="email" label="邮箱 " ></el-table-column>
				<!-- <el-table-column prop="qq" label="QQ "></el-table-column> -->
				<!-- <el-table-column prop="weixin" label="微信 "></el-table-column> -->
				<el-table-column label="操作" width="140">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
			</el-table>
		</template>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-input v-show="0" v-model="editForm.userId" auto-complete="off"></el-input>
				<el-row>
					<el-col :span="12">
						<el-form-item label="登录名" prop="loginName">
							<el-input v-model="editForm.loginName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名">
							<el-input v-model="editForm.userCaption" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="性别">
							<el-radio-group v-model="editForm.sex">
								<el-radio class="radio" :label="1">男</el-radio>
								<el-radio class="radio" :label="0">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">	
						<el-form-item label="生日">
							<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birthday"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="电话">
							<el-input v-model="editForm.telephone" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱">
							<el-input v-model="editForm.email" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-row>
					<el-col :span="12">
						<el-form-item label="QQ">
							<el-input v-model="editForm.qq" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">	
						<el-form-item label="微信">
							<el-input v-model="editForm.weixin" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="editForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="登录名" prop="loginName">
							<el-input v-model="addForm.loginName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名">
							<el-input v-model="addForm.userCaption" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="性别">
							<el-radio-group v-model="addForm.sex">
								<el-radio class="radio" :label="1">男</el-radio>
								<el-radio class="radio" :label="0">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">	
						<el-form-item label="生日">
							<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birthday"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="电话">
							<el-input v-model="addForm.telephone" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱">
							<el-input v-model="addForm.email" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-row>
					<el-col :span="12">
						<el-form-item label="QQ">
							<el-input v-model="addForm.qq" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">	
						<el-form-item label="微信">
							<el-input v-model="addForm.weixin" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="addForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
	import util from '../../common/js/util'
	// import { getUserList } from 'api/user';
	//import NProgress from 'nprogress'
	// import $http from '../../Http';
	export default {
		data() {
			return {
				filters: {//查询条件
					loginName: ''
				},
				loading: false,
				users:[],
				total: 0,
				page: 1,
				pageSize:10,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {//编辑约束
					loginName: [
						{ required: true, message: '请输入登录名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					loginName: [
						{ required: true, message: '请输登录名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {}
			}
		},
		methods: {
			//获取用户列表
			getUsers: function () {
				var that = this;
				let para = {//查询与分页条件
					loginName: this.filters.loginName||null,
					pageNum:this.page,
					pageSize:this.pageSize
				};
				this.loading = true;
				//NProgress.start();
				this.$http.get('user',{params:para}).then((res) => {
					that.users = res.data.list;
					that.page = res.data.pageNum;
					that.pageSize = res.data.pageSize;
					this.total = res.data.total;
					that.loading = false;
					//NProgress.done();
				});
			},
			handleCurrentChange:function(val){
				this.page = val;
				this.getUsers();
			},
			handleAdd:function(){
				this.addFormVisible = true;
				this.addForm = {};
			},
			addSubmit:function(){
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birthday = (!para.birthday || para.birthday == '') ? '' : util.formatDate.format(new Date(para.birthday), 'yyyy-MM-dd');
							this.$http.post('user',para
							// ,{
							// 	headers: {
							// 		'Content-Type': 'application/x-www-form-urlencoded'
							// 	}
							// }
							).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			handleEdit:function(index,row){
				this.editFormVisible = true;
				//可根据id查询
				this.editForm = Object.assign({}, row);
			},
			editSubmit:function(){
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birthday = (!para.birthday || para.birthday == '') ? '' : util.formatDate.format(new Date(para.birthday), 'yyyy-MM-dd');
							this.$http.post('user',para
							// ,{
							// 	headers: {
							// 		'Content-Type': 'application/x-www-form-urlencoded'
							// 	}
							// }
							).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			handleDel:function(index,row){
				this.$confirm('确认删除该条数据？', '提示', {}).then(() => {
					this.$http.delete('user/'+row.userId).then(res=>{
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			batchRemove:function(){
				var ids = this.sels.map(item => item.userId);
				// debugger
				var paras = [];
				ids.forEach((id,i)=>{
					paras.push('ids='+id);
				});
				// para.ids = ids;
				this.$confirm('确认删除该批数据？', '提示', {}).then(() => {
					this.$http.delete('user',{params:{ids:ids}}).then(res=>{
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				});
			}
		},
		mounted() {
			this.getUsers();
			// var that = this;
			// this.$http.get('user').then(res=>{
			// 	// debugger
			// 	that.users = res.data;
			// });
		}
	};

</script>

<style scoped>

</style>