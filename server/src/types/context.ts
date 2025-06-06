import { UserService } from '../services/userService'
import { SleepService } from '../services/sleepService'

export interface AppContext {
  userService: UserService
  sleepService: SleepService
}
