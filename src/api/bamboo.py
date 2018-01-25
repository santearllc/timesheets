import requests, json

class Bamboo:
	api_key = 'da031971a86b4eda99989c58a4547c6477781eab'
	subdomain = 'atomicfiction'
	headers = {'accept': 'application/json'}

	def get_users(self):
		page = requests.get('http://api.bamboohr.com/api/gateway.php/'+self.subdomain+'/v1/employees/directory', headers=self.headers, auth=requests.auth .HTTPBasicAuth(self.api_key, 'x'))
		#print page.text
		try: 
			return json.loads(page.text)
		except TypeError:
			return False

	def get_user_byEmail(self, email):
		users = self.get_users()

		if users: 
			for user in users['employees']:
				if user['workEmail'] in [email]:
					return user
		
		return False


